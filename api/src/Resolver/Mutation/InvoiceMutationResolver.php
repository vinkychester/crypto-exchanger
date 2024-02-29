<?php


namespace App\Resolver\Mutation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Service\Callback\CallbackService;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payment\setInvoice;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class InvoiceMutationResolver implements MutationResolverInterface
{
    private \Doctrine\ORM\EntityManagerInterface $entityManager;
    private \ItlabStudio\ApiClient\Service\ApiClient $apiClient;
    private \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator;
    private \Symfony\Component\Messenger\MessageBusInterface $bus;

    /**
     * RequisitionMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \ItlabStudio\ApiClient\Service\ApiClient $apiClient
     * @param \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator
     * @param \Symfony\Component\Messenger\MessageBusInterface $bus
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \ItlabStudio\ApiClient\Service\ApiClient $apiClient,
        \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator,
        \Symfony\Component\Messenger\MessageBusInterface $bus
    ){
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
        $this->generator = $generator;
        $this->bus = $bus;
    }

    /**
     * @param iterable<\App\Entity\Invoice> $collection
     *
     * @return iterable<\App\Entity\Invoice>
     */
    public function __invoke($item, array $context): ?\App\Entity\Invoice
    {
        $item->setReferenceId(Uuid::uuid4());
        $item->setDirection(Pair::PAYMENT);

        /** @var \App\Entity\Requisition $requisition */
        $requisition = $item->getRequisition();
        /** @var Pair $pair */
        $pair = $requisition->getPair();

        /** @var \App\Entity\BankDetail $bankDetail */
        $bankDetail = $this->entityManager->getRepository(\App\Entity\BankDetail::class)->findBankDetailsByParams(
            $requisition, $pair->getPayment(), Pair::PAYMENT
        );

        // CREATE INVOICE PAYMENT
        $invoice = CallbackService::createInvoice($this->generator, $item, Pair::PAYMENT);

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
            $invoice['amount'] = (string)$requisition->getPaymentAmount();
        }

        if ($bankDetail) {
            $collection = [];
            $attributes = $bankDetail->getAttributes()->getValues();
            array_walk($attributes, static function ($value) use (&$collection) {
                $collection[$value->getName()] = $value->getValue();
            });
            $invoice['attributes'] = $collection;
        }

        try {
            $requestContent = $this->apiClient->ControlPanel()->Payment()->setInvoice($invoice)->getData()->first();
            if ($requestContent instanceof setInvoice) {
                $item->setExternalId(Uuid::fromString($requestContent->getId()));
                if ($requestContent->getStatus() === "FAIL") {
                    CallbackService::unsubscribeFailStatus($this->entityManager, $this->bus, $item);
                    throw new \RuntimeException("INVALID INVOICE CALLBACK", 500);
                }
            }
        } catch (\Exception $exception) {
            CallbackService::unsubscribeFailStatus($this->entityManager, $this->bus, $item);
            throw new \RuntimeException("INVALID INVOICE CALLBACK", 500);
        }

        $requisition->setStatus(\App\Entity\Requisition::STATUS_INVOICE);
        $flowContent = $requestContent->getFlowData();

        if ($flowContent) {
            \App\Service\FlowData\FlowDataService::setFlowData(
                $this->entityManager, $item, $flowContent, $requestContent->getStatus()
            );;
        }

//        $update = new \Symfony\Component\Mercure\Update(
//            Invoice::INVOICE_TOPIC . $requisition->getId(),
//            json_encode(['status' => Invoice::STATUS_NEW, 'requisition_status' => $requisition->getStatus()])
//        );
//        $this->bus->dispatch($update);

        return $item;
    }
}