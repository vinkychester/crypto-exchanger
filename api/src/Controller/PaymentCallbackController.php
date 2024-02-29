<?php


namespace App\Controller;

use App\Entity\CreditCard;
use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Service\Callback\CallbackService;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payment\setInvoice;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class PaymentCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class PaymentCallbackController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{
    private \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer;
    private \Symfony\Component\Messenger\MessageBusInterface $bus;
    private \Symfony\Component\Notifier\ChatterInterface $chatter;
    private \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator;
    private \ItlabStudio\ApiClient\Service\ApiClient $apiClient;
    private \Symfony\Component\Mercure\HubInterface $hub;
    private \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * PaymentCallbackController constructor.
     * @param \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer
     * @param \Symfony\Component\Messenger\MessageBusInterface $bus
     * @param \Symfony\Component\Notifier\ChatterInterface $chatter
     * @param \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator
     * @param \ItlabStudio\ApiClient\Service\ApiClient $apiClient
     * @param \Symfony\Component\Mercure\HubInterface $hub
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     */
    public function __construct(
        \Symfony\Component\Serializer\Normalizer\DenormalizerInterface $denormalizer,
        \Symfony\Component\Messenger\MessageBusInterface               $bus,
        \Symfony\Component\Notifier\ChatterInterface                   $chatter,
        \Symfony\Component\Routing\Generator\UrlGeneratorInterface     $generator,
        \ItlabStudio\ApiClient\Service\ApiClient                       $apiClient,
        \Symfony\Component\Mercure\HubInterface                        $hub,
        \Doctrine\ORM\EntityManagerInterface                           $entityManager
    )
    {
        $this->denormalizer = $denormalizer;
        $this->bus = $bus;
        $this->chatter = $chatter;
        $this->generator = $generator;
        $this->apiClient = $apiClient;
        $this->hub = $hub;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/payment-callback/{id}", name="payment_callback")
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param string $id
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function paymentCallback(\Symfony\Component\HttpFoundation\Request $request, string $id): Response
    {
        $chatMessage = new \Symfony\Component\Notifier\Message\ChatMessage('');
        $chatMessage->transport("telegram_debug");

        $paymentInvoice = $this->getDoctrine()->getRepository(Invoice::class)->find($id);

        if (!$paymentInvoice) {
            return new Response("UNSUBSCRIBE OF NOT EXIST INVOICE (PAYMENT)", 200);
        }

        /** @var \App\Entity\Requisition $requisition */
        $requisition = $paymentInvoice->getRequisition();
        /** @var Pair $pair */
        $pair = $requisition->getPair();

        $content = json_decode($request->getContent(), true)["data"];
        $response = json_decode($request->getContent(), true);
        $requestPaymentContent = $this->denormalizer->denormalize($content, setInvoice::class, "array");

        // CHECK SIGNATURE
        if (!\App\Utils\Signature::check(
            json_encode($content, JSON_UNESCAPED_SLASHES),
            $response['signature'],
            $_ENV['JWT_CONTROL_PANEL_SECRET']
        )) {
            return new Response("UNSUBSCRIBE OF SIGNATURE", 200);
        }

        // UNSUBSCRIBE OF NEW STATUS
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_NEW) {
            return new Response("UNSUBSCRIBE OF NEW STATUS (PAYMENT CALLBACK)", 200);
        }

        // UNSUBSCRIBE FAIL STATUS
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_FAIL) {
            CallbackService::unsubscribeFailStatus($this->entityManager, $this->bus, $paymentInvoice);
            return new Response("UNSUBSCRIBE FAIL STATUS (PAYMENT CALLBACK)", 200);
        }

        // UNSUBSCRIBE OF PROCESSED
        if ($paymentInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            $this->chatter->send($chatMessage->subject("UNSUBSCRIBE OF PROCESSED STATUS (PAYMENT CALLBACK)"));
            return new Response("UNSUBSCRIBE OF PROCESSED STATUS (PAYMENT CALLBACK)", 200);
        }

        // SEND BOT NOTIFICATION
        $this->chatter->send($chatMessage->subject("PAYMENT CALLBACK DATA: \n" .
            "REQUISITION ID:   " . strtoupper(explode("-", $requisition->getId())[0]) . "\n" .
            "STATUS:           {$requestPaymentContent->getStatus()}\n" .
            "PROCESSED AMOUNT: {$requestPaymentContent->getProcessedAmount()}\n" .
            "AMOUNT:           {$requestPaymentContent->getAmount()}\n" .
            "IN: " .
            $pair->getPayment()->getPaymentSystem()->getName() . " " .
            $pair->getPayment()->getCurrency()->getAsset() . " " .
            $pair->getPayment()->getCurrency()->getService()->getName() . "\n" .
            "OUT: " .
            $pair->getPayout()->getPaymentSystem()->getName() . " " .
            $pair->getPayout()->getCurrency()->getAsset() . " " .
            $pair->getPayout()->getCurrency()->getService()->getName()
        ));

        $paymentInvoice->setPaidAmount($requestPaymentContent->getProcessedAmount());
        $paymentInvoice->setAmount($requestPaymentContent->getAmount());
        $paymentInvoice->setExternalId(\Ramsey\Uuid\Uuid::fromString($requestPaymentContent->getId()));

        $this->chatter->send($chatMessage->subject("INSERT FLOW DATA"));

        // INSERT FLOW DATA
        $paymentFlowContent = $requestPaymentContent->getFlowData();
        try {
            if ($paymentFlowContent) {
                \App\Service\FlowData\FlowDataService::setFlowData(
                    $this->entityManager, $paymentInvoice, $paymentFlowContent, $requestPaymentContent->getStatus()
                );
            }
        }  catch (\Exception $exception) {
            $this->chatter->send($chatMessage->subject("INSERT FLOW DATA ERROR " . $exception->getMessage()));
        }


        // CREATE PAYOUT
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_PROCESSED) {
            // SET STATUS TO REQUISITION
            $requisition->setStatus(\App\Entity\Requisition::STATUS_PROCESSED);

            if (Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag() && array_key_exists('amount', $paymentFlowContent)) {
                $requisition->setPaymentAmount($paymentFlowContent["amount"]);
            }

            $this->chatter->send($chatMessage->subject("START CREDIT"));

            // CREDIT CARD VERIFICATION
            if ($requisition->getPair()->getPayment()->getIsCardVerification() && array_key_exists('cardMask', $paymentFlowContent)) {
                $this->chatter->send($chatMessage->subject("START CHECK CARD VERIFICATION (PAYMENT CALLBACK)"));
                /** @var CreditCard $creditCard */
                $creditCard = $this->getDoctrine()->getRepository(CreditCard::class)->findOneBy([
                    'cardMask' => $paymentFlowContent['cardMask'], 'client' => $requisition->getClient(), 'status' => CreditCard::VERIFIED
                ]);

                if (!$creditCard || $creditCard->getStatus() !== CreditCard::VERIFIED) {
                    $requisition->setStatus(\App\Entity\Requisition::STATUS_CARD_VERIFICATION);
                    $paymentInvoice->setStatus(Invoice::STATUS_CARD_VERIFICATION);
                    $cardMaskFlow = $this->getDoctrine()->getRepository(\App\Entity\FlowData::class)->findOneBy([
                        'name' => 'cardMask', 'invoice' => $paymentInvoice
                    ]);

                    if ($cardMaskFlow) {
                        $cardMaskFlow->setStatus(Invoice::STATUS_CARD_VERIFICATION);
                        $this->getDoctrine()->getManager()->persist($cardMaskFlow);
                    }

                    $this->getDoctrine()->getManager()->persist($requisition);
                    $this->getDoctrine()->getManager()->persist($paymentInvoice);
                    $this->getDoctrine()->getManager()->flush();
                    // send error status
                    $update = new \Symfony\Component\Mercure\Update(
                        Invoice::CALLBACK_TOPIC . $requisition->getId(),
                        json_encode(['status' => Invoice::STATUS_CARD_VERIFICATION, 'requisition_status' => $requisition->getStatus()])
                    );

                    // The Publisher service is an invokable object
                    $this->bus->dispatch($update);
                    return new Response("NEED CARD VERIFICATION PAYMENT CALLBACK", 200);
                }
            }

            // UPDATE REQUISITION FEE
            try {
                (new \App\Service\RequisitionFeeBuilder\RequisitionFeeBuilder($this->entityManager))
                    ->setFee($requisition, $requisition->getPair()->getPayment())
                    ->storeItem();
            } catch (\Exception $exception) {
                $this->chatter->send($chatMessage->subject("ERROR FEE " . $exception->getMessage()));
            }

            // RECALCULATE REQUISITION AMOUNT
            CallbackService::recalculateRequisitionAmount($this->entityManager, $requisition, $paymentInvoice);

            /** @var \App\Entity\Invoice $payoutInvoice */
            $payoutInvoice = $this->getDoctrine()->getRepository(\App\Entity\Invoice::class)->findOneBy([
                'direction' => Pair::PAYOUT, 'requisition' => $requisition
            ]);

            if ($payoutInvoice) {
                return new Response("UNSUBSCRIBE EXIST PAYOUT INVOICE", 200);
            }

            // CREATE PAYOUT INVOICE
            $payoutInvoice = new Invoice();
            $payoutInvoice->setRequisition($requisition);
            $payoutInvoice->setDirection(Pair::PAYOUT);

            // CREATE INVOICE ATTRIBUTES
            /** @var array $invoice */
            $invoice = CallbackService::createInvoice($this->generator, $payoutInvoice, Pair::PAYOUT);

            if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
                $invoice['amount'] = (string)round(CallbackService::recalculatePayoutAmount($requisition), 2);
            }

            /** @var \App\Entity\BankDetail $payoutBankDetail */
            $payoutBankDetail = $this->getDoctrine()->getRepository(\App\Entity\BankDetail::class)->findBankDetailsByParams(
                $requisition, $pair->getPayout(), Pair::PAYOUT
            );

            if ($payoutBankDetail) {
                $collection = [];
                $attributes = $payoutBankDetail->getAttributes()->getValues();
                array_walk($attributes, static function ($value) use (&$collection) {
                    $collection[$value->getName()] = $value->getValue();
                });
                $invoice['attributes'] = $collection;
            }

            $this->chatter->send($chatMessage->subject("CREATE PAYOUT"));

            // CREATE PAYOUT
            try {
                $requestContent = $this->apiClient->ControlPanel()->Payout()->setInvoice($invoice)->getData()->first();
                $payoutInvoice->setExternalId(Uuid::fromString($requestContent->getId()));
                if ($requestContent->getStatus() === "FAIL") {
                    // ERROR PAYOUT
                    $this->chatter->send($chatMessage->subject("ERROR FAIL (PAYMENT CALLBACK)"));
                    CallbackService::unsubscribeFailStatus($this->getDoctrine()->getManager(), $this->bus, $paymentInvoice);
                    return new Response("INVALID PAYMENT CALLBACK", 200);
                }
            } catch (\Exception $exception) {
                $this->chatter->send($chatMessage->subject("ERROR CREATE PAYOUT " . $exception->getMessage()));
                CallbackService::unsubscribeFailStatus($this->getDoctrine()->getManager(), $this->bus, $paymentInvoice);
                return new Response("INVALID PAYMENT CALLBACK", 200);
            }

            $requisition->setStatus(\App\Entity\Requisition::STATUS_PROCESSED);
            $paymentInvoice->setStatus(Invoice::STATUS_PROCESSED);

            // INSERT FLOW DATA
            $payoutFlowContent = $requestContent->getFlowData();
            if ($payoutFlowContent) {
                \App\Service\FlowData\FlowDataService::setFlowData(
                    $this->getDoctrine()->getManager(), $payoutInvoice, $payoutFlowContent, $requestContent->getStatus()
                );
            }

            $this->getDoctrine()->getManager()->persist($payoutInvoice);
        }

        $this->getDoctrine()->getManager()->persist($paymentInvoice);
        $this->getDoctrine()->getManager()->persist($requisition);
        $this->getDoctrine()->getManager()->flush();

        $update = new \Symfony\Component\Mercure\Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => $requestPaymentContent->getStatus(), 'requisition_status' => $requisition->getStatus()])
        );
        $this->bus->dispatch($update);

        $this->chatter->send($chatMessage->subject("END CALLBACK PAYMENT"));
        return new Response("END CALLBACK", 200);
    }
}