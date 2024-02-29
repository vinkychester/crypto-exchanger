<?php

namespace App\EntityListener;


use App\Entity\CreditCard;
use App\Entity\Currency;
use App\Entity\FlowData;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Service\Callback\CallbackService;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;


class CreditCardEntityListener
{
    public const CARD_MASK = "cardMask";
    private \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator;
    private \ItlabStudio\ApiClient\Service\ApiClient $apiClient;
    private \Symfony\Component\Messenger\MessageBusInterface $bus;
    private \Symfony\Component\Notifier\ChatterInterface $chatter;

    /**
     * @param \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator
     * @param \ItlabStudio\ApiClient\Service\ApiClient $apiClient
     * @param \Symfony\Component\Messenger\MessageBusInterface $bus
     * @param \Symfony\Component\Notifier\ChatterInterface $chatter
     */
    public function __construct(
        \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator,
        \ItlabStudio\ApiClient\Service\ApiClient $apiClient,
        \Symfony\Component\Messenger\MessageBusInterface $bus,
        \Symfony\Component\Notifier\ChatterInterface $chatter
    ) {
        $this->generator = $generator;
        $this->apiClient = $apiClient;
        $this->bus = $bus;
        $this->chatter = $chatter;
    }

    /**
     * @param CreditCard $creditCard
     * @param LifecycleEventArgs $eventArgs
     * @throws \Doctrine\ORM\ORMException
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     */
    public function postUpdate(CreditCard $creditCard, LifecycleEventArgs $eventArgs)
    {
        $client = $creditCard->getClient();
        switch ($creditCard->getStatus()) {
            case CreditCard::VERIFIED:
                $flowData = $eventArgs->getEntityManager()->getRepository(FlowData::class)->findBy([
                    'name' => self::CARD_MASK, 'value' => $creditCard->getCardMask()
                ]);

                $em = $eventArgs->getEntityManager();
                $generator = $this->generator;
                $apiClient = $this->apiClient;
                $bus = $this->bus;
                $chatter = $this->chatter;

                $chatMessage = new \Symfony\Component\Notifier\Message\ChatMessage('');
                $chatMessage->transport("telegram_debug");

                if ($flowData) {
                    array_walk($flowData, static function ($value) use ($em, $generator, $apiClient, $bus, $chatter, $chatMessage) {
                        /** @var Invoice $invoice */
                        $invoice = $value->getInvoice();
                        /** @var Requisition $requisition */
                        $requisition = $invoice->getRequisition();
                        /** @var \App\Entity\Pair $pair */
                        $pair = $invoice->getRequisition()->getPair();

                        if ($pair->getPayment()->getIsCardVerification() && $invoice->getStatus() === Requisition::STATUS_CARD_VERIFICATION) {
                            // UPDATE REQUISITION FEE
                            (new \App\Service\RequisitionFeeBuilder\RequisitionFeeBuilder($em))
                                ->setFee($requisition, $requisition->getPair()->getPayment())
                                ->storeItem();

                            // RECALCULATE REQUISITION AMOUNT
                            CallbackService::recalculateRequisitionAmount($em, $requisition, $invoice);

                            /** @var Invoice $payoutInvoice */
                            $payoutInvoice = $em->getRepository(Invoice::class)->findOneBy([
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
                            $apiInvoice = CallbackService::createInvoice($generator, $payoutInvoice, Pair::PAYOUT);

                            if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
                                $apiInvoice['amount'] = (string)round(CallbackService::recalculatePayoutAmount($requisition), 2);
                            }

                            /** @var \App\Entity\BankDetail $payoutBankDetail */
                            $payoutBankDetail = $em->getRepository(\App\Entity\BankDetail::class)->findBankDetailsByParams(
                                $requisition, $pair->getPayout(), Pair::PAYOUT
                            );

                            if ($payoutBankDetail) {
                                $collection = [];
                                $attributes = $payoutBankDetail->getAttributes()->getValues();
                                array_walk($attributes, static function ($value) use (&$collection) { $collection[$value->getName()] = $value->getValue(); });
                                $apiInvoice['attributes'] = $collection;
                            }

                            // CREATE PAYOUT
                            try {
                                $requestContent = $apiClient->ControlPanel()->Payout()->setInvoice($apiInvoice)->getData()->first();
                                $payoutInvoice->setExternalId(Uuid::fromString($requestContent->getId()));
                                if ($requestContent->getStatus() === "FAIL") {
                                    // ERROR PAYOUT
                                    $chatter->send($chatMessage->subject("ERROR FAIL (PAYMENT CALLBACK)"));
                                    CallbackService::unsubscribeFailStatus($em, $bus, $invoice);
                                    return new Response("INVALID PAYMENT CALLBACK", 200);
                                }
                            } catch (\Exception $exception) {
                                $chatter->send($chatMessage->subject("ERROR CREATE PAYOUT " . $exception->getMessage()));
                                CallbackService::unsubscribeFailStatus($em, $bus, $invoice);
                                return new Response("INVALID PAYMENT CALLBACK", 200);
                            }

                            $requisition->setStatus(\App\Entity\Requisition::STATUS_PROCESSED);
                            $invoice->setStatus(Invoice::STATUS_PROCESSED);

                            // INSERT FLOW DATA
                            $payoutFlowContent = $requestContent->getFlowData();
                            if ($payoutFlowContent) {
                                \App\Service\FlowData\FlowDataService::setFlowData(
                                    $em, $payoutInvoice, $payoutFlowContent, $requestContent->getStatus()
                                );
                            }

                            $em->persist($payoutInvoice);
                            $em->persist($requisition);
                            $em->flush();

                            $update = new \Symfony\Component\Mercure\Update(
                                Invoice::CALLBACK_TOPIC . $requisition->getId(),
                                json_encode(['status' => $invoice->getStatus(), 'requisition_status' => $requisition->getStatus()])
                            );
                            $bus->dispatch($update);

                            $chatter->send($chatMessage->subject("END CALLBACK PAYMENT"));
                        }
                    });
                }
            break;
        }
    }
}