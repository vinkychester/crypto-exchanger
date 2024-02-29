<?php


namespace App\Controller;

use App\Entity\Invoice;
use App\Entity\Pair;
use App\Service\Callback\CallbackService;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payout\setInvoice;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class PayoutCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class PayoutCallbackController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{
    private \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer;
    private \Symfony\Component\Messenger\MessageBusInterface $bus;
    private \Symfony\Component\Notifier\ChatterInterface $chatter;

    /**
     * PayoutCallbackController constructor.
     * @param \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer
     * @param \Symfony\Component\Messenger\MessageBusInterface $bus
     * @param \Symfony\Component\Notifier\ChatterInterface $chatter
     */
    public function __construct(
        \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer,
        \Symfony\Component\Messenger\MessageBusInterface $bus,
        \Symfony\Component\Notifier\ChatterInterface $chatter
    ) {
        $this->denormalizer = $denormalizer;
        $this->bus = $bus;
        $this->chatter = $chatter;
    }

    /**
     * @Route("/payout-callback/{id}", name="payout_callback")
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param string $id
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     */
    public function payoutCallback(\Symfony\Component\HttpFoundation\Request $request, string $id): Response
    {
        $chatMessage = new \Symfony\Component\Notifier\Message\ChatMessage('');
        $chatMessage->transport("telegram_debug");

        /** @var Invoice $payoutInvoice */
        $payoutInvoice = $this->getDoctrine()->getManager()->getRepository(Invoice::class)->find($id);

        if (!$payoutInvoice) {
            return new Response("UNSUBSCRIBE OF NOT EXIST INVOICE (PAYOUT)", 200);
        }

        /** @var \App\Entity\Requisition $requisition */
        $requisition = $payoutInvoice->getRequisition();
        /** @var Pair $pair */
        $pair = $requisition->getPair();

        $content = json_decode($request->getContent(), true)["data"];
        $response = json_decode($request->getContent(), true);
        $requestPayoutContent = $this->denormalizer->denormalize($content, setInvoice::class, "array");

        // CHECK SIGNATURE
        if (!\App\Utils\Signature::check(
            json_encode($content, JSON_UNESCAPED_SLASHES),
            $response['signature'],
            $_ENV['JWT_CONTROL_PANEL_SECRET']
        )) {
            return new Response("UNSUBSCRIBE OF SIGNATURE", 200);
        }

        // UNSUBSCRIBE OF NEW STATUS
        if ($requestPayoutContent->getStatus() === Invoice::STATUS_NEW) {
            return new Response("UNSUBSCRIBE OF NEW STATUS (PAYOUT CALLBACK)", 200);
        }

        // UNSUBSCRIBE FAIL STATUS
        if ($payoutInvoice->getStatus() === Invoice::STATUS_FAIL) {
            CallbackService::unsubscribeFailStatus($this->getDoctrine()->getManager(), $this->bus, $payoutInvoice);
            return new Response("UNSUBSCRIBE FAIL STATUS (PAYOUT CALLBACK)", 200);
        }

        // UNSUBSCRIBE OF PROCESSED
        if ($payoutInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            return new Response("UNSUBSCRIBE OF PROCESSED STATUS (PAYOUT CALLBACK)", 200);
        }

        // SEND BOT NOTIFICATION
        $this->chatter->send($chatMessage->subject("PAYOUT CALLBACK DATA: \n" .
            "REQUISITION ID:   " . strtoupper(explode("-", $requisition->getId())[0]) . "\n" .
            "STATUS:           {$requestPayoutContent->getStatus()}\n" .
            "PROCESSED AMOUNT: {$requestPayoutContent->getProcessedAmount()}\n" .
            "AMOUNT:           {$requestPayoutContent->getAmount()}\n" .
            "IN: " .
            $pair->getPayment()->getPaymentSystem()->getName() . " " .
            $pair->getPayment()->getCurrency()->getAsset() . " " .
            $pair->getPayment()->getCurrency()->getService()->getName() ."\n" .
            "OUT: " .
            $pair->getPayout()->getPaymentSystem()->getName() . " " .
            $pair->getPayout()->getCurrency()->getAsset() . " " .
            $pair->getPayout()->getCurrency()->getService()->getName()
        ));

        // SET INVOICE DATA
        $payoutInvoice->setStatus($requestPayoutContent->getStatus());
        $payoutInvoice->setPaidAmount($requestPayoutContent->getProcessedAmount());
        $payoutInvoice->setAmount($requestPayoutContent->getAmount());
        $payoutInvoice->setExternalId(Uuid::fromString($requestPayoutContent->getId()));

        // INSERT FLOW DATA
        $flowContent = $requestPayoutContent->getFlowData();
        if ($flowContent) {
            \App\Service\FlowData\FlowDataService::setFlowData(
                $this->getDoctrine()->getManager(), $payoutInvoice, $flowContent, $requestPayoutContent->getStatus()
            );
        }

        // END REQUISITION
        if ($payoutInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            // UPDATE FEE
            (new \App\Service\RequisitionFeeBuilder\RequisitionFeeBuilder($this->getDoctrine()->getManager()))
                ->setFee($requisition, $requisition->getPair()->getPayout())
                ->storeItem();
        }

        // UPDATE REQUISITION DETAILS
        $requisition->setPayoutAmount($payoutInvoice->getPaidAmount());

        /** @var \App\Entity\Service $service */
        $service = $requisition->getPair()->getPayout()->getCurrency()->getService();

        if ($service->getName() === "UaPay" || $service->getName() === "Kuna") {
            $requisition->setPayoutAmount($payoutInvoice->getAmount());
        }

        // RECALCULATE COURSE
        CallbackService::recalculateRequisitionCourse($requisition);
        // RECALCULATE REQUISITION PROFIT
        CallbackService::recalculateProfit($requisition);

        $requisition->setStatus(\App\Entity\Requisition::STATUS_FINISHED);

        $this->getDoctrine()->getManager()->persist($requisition);
        $this->getDoctrine()->getManager()->flush();

        $update = new \Symfony\Component\Mercure\Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => $requestPayoutContent->getStatus(), 'requisition_status' => $requisition->getStatus()])
        );
        $this->bus->dispatch($update);

        $this->chatter->send($chatMessage->subject("END CALLBACK PAYOUT"));
        return new Response("END CALLBACK", 200);
    }
}