<?php

namespace App\Service\Callback;

use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Entity\RequisitionFee;
use JetBrains\PhpStorm\ArrayShape;
use Symfony\Component\Routing\Generator\UrlGenerator;

/**
 * Class CallbackService
 * @package App\Service\Callback
 */
class CallbackService
{
    /**
     * @param \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator
     * @param \App\Entity\Invoice $invoice
     * @param string $direction
     * @return array
     */
    #[ArrayShape([
        'paymentSystem' => "mixed",
        'amount' => "string",
        'currency' => "mixed",
        'referenceId' => "string",
        'connection' => "string",
        'returnUrl' => "string",
        'callBackUrl' => "string"
    ])] public static function createInvoice(
        \Symfony\Component\Routing\Generator\UrlGeneratorInterface $generator,
        Invoice $invoice,
        string $direction
    ): array
    {
        $requisition = $invoice->getRequisition();
        /** @var \App\Entity\Pair $pair */
        $pair = $requisition->getPair();

        $pairUnit = "get" . ucfirst($direction);
        $amount = "get" . ucfirst($direction) . "Amount";
        $route = "{$direction}_callback";

        return [
            'paymentSystem' => $pair->$pairUnit()->getPaymentSystem()->getSubName(),
            'amount'        => (string)round($requisition->$amount(), 2),
            'currency'      => $pair->$pairUnit()->getCurrency()->getAsset(),
            'referenceId'   => $requisition->getId()->toString(),
            'connection'    => (string)$pair->$pairUnit()->getCurrency()->getService()->getConnection(),
            'returnUrl'     => "{$_ENV['HOST']}/panel/requisition-details/{$requisition->getId()}",
            'callBackUrl'   => $generator->generate($route, ["id" => $invoice->getId()], \Symfony\Component\Routing\Generator\UrlGeneratorInterface::ABSOLUTE_URL)
        ];
    }

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \Symfony\Component\Mercure\HubInterface $hub
     * @param \App\Entity\Invoice $invoice
     */
    public static function unsubscribeFailStatus(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \Symfony\Component\Messenger\MessageBusInterface $bus,
        Invoice $invoice
    ) {
        $requisition = $invoice->getRequisition();
        // SET ERROR STATUS
        $requisition->setStatus(\App\Entity\Requisition::STATUS_ERROR);
        $invoice->setStatus(Invoice::STATUS_PROCESSED);

        $entityManager->persist($requisition);
        $entityManager->persist($invoice);
        $entityManager->flush();

        // send error status
        $update = new \Symfony\Component\Mercure\Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => Invoice::STATUS_FAIL, 'requisition_status' => $requisition->getStatus()])
        );
        $bus->dispatch($update);
    }

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \App\Entity\Requisition $requisition
     * @param Invoice $invoice
     */
    public static function recalculateRequisitionAmount(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \App\Entity\Requisition $requisition,
        \App\Entity\Invoice $invoice
    )
    {
        /** @var RequisitionFee $fee */
        $fee = $entityManager->getRepository(RequisitionFee::class)->findOneBy([
            'requisition' => $requisition, 'type' => Pair::PAYMENT
        ]);

        /** @var \App\Entity\Pair $pair */
        $pair = $requisition->getPair();
        $amount = Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag() ? $requisition->getPaymentAmount() : $invoice->getAmount();

        if (Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag()) {
            $requisition->setPaymentAmount($amount);
            \App\Service\Calculation\src\CalculationService::calculate('payment')->calculateAmount($pair, $amount, $fee->getPairPercent());
            $requisition->setPayoutAmount($pair->getPayout()->getAmount());
        }

        if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
            $requisition->setAmountWithFee(round($invoice->getPaidAmount(), 2));
        }
    }

    /**
     * @param \App\Entity\Requisition $requisition
     * @return float|int
     */
    public static function recalculatePayoutAmount(\App\Entity\Requisition $requisition): float|int
    {
        $amount = $requisition->getAmountWithFee() / $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate();
        return $amount * (100 - \App\Service\Calculation\src\Course\Course::calculateLastFee($requisition->getPair(), $requisition->getPair()->getPercent())) / 100;
    }

    /**
     * @param \App\Entity\Requisition $requisition
     */
    public static function recalculateRequisitionCourse(\App\Entity\Requisition $requisition)
    {
        $pair = $requisition->getPair();

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
            $paymentWithCommission = $requisition->getPaymentAmount()
                - ($requisition->getPaymentAmount() * $pair->getPayment()->getFee()->getPercent() / 100)
                - $pair->getPayment()->getFee()->getConstant();
            $payoutWithCommission = $requisition->getPayoutAmount()
                * ((100 + $requisition->getPair()->getPayout()->getFee()->getPercent()) / 100)
                + $requisition->getPair()->getPayout()->getFee()->getConstant();

            $requisition->setCourse($payoutWithCommission / $paymentWithCommission);
        }

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
            $tmp = $requisition->getPayoutAmount() * ((100 + $requisition->getPair()->getPayout()->getFee()->getPercent()) / 100)
                + $requisition->getPair()->getPayout()->getFee()->getConstant();

            $requisition->setCourse($requisition->getAmountWithFee() / $tmp);
        }
    }

    /**
     * @param \App\Entity\Requisition $requisition
     */
    public static function recalculateProfit(\App\Entity\Requisition $requisition)
    {
        /** @var \App\Entity\Pair $pair */
        $pair = $requisition->getPair();
        /** @var \App\Entity\Currency $currency */
        $currency = $pair->getPayment()->getCurrency();

        if ($currency->getTag() === Currency::TYPE_CURRENCY) {
            $requisition->setProfit($requisition->getAmountWithFee() * ($requisition->getPairPercent() / 100));
        }

        if ($currency->getTag() === Currency::TYPE_CRYPTO) {
            $amountWithFee = $requisition->getPaymentAmount()
                * (100 - $requisition->getPair()->getPayment()->getFee()->getPercent()) / 100
                - $requisition->getPair()->getPayment()->getFee()->getConstant();
            $requisition->setProfit($amountWithFee * $requisition->getPairPercent() / 100);
        }
    }
}