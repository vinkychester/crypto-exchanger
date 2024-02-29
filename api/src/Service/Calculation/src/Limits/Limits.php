<?php


namespace App\Service\Calculation\src\Limits;


use App\Entity\Pair;
use App\Service\Calculation\src\States\Payment;
use App\Service\Calculation\src\States\Payout;

/**
 * Class Limits
 * @package App\Service\Calculation\src\Limits
 */
class Limits implements LimitsInterface
{
    /**
     * @param float $amount
     * @param float $percent
     * @return float|int
     */
    protected static function calculatePercent(float $amount, float $percent): float|int
    {
        return $amount + ($amount * $percent) / 100;
    }

    public static function calculateMin(Pair $pair): void
    {
        $payment = $pair->getPayment();
        $payout = $pair->getPayout();

        $paymentMin = self::calculatePercent($payment->getFee()->getMin(), $pair->getPercent());
        $payoutMin = self::calculatePercent($payout->getFee()->getMin(), $pair->getPercent());

        Payment::calculateAmount($pair, $paymentMin);

        if ($payoutMin < $payout->getAmount()) {
            $payout->setMin($payout->getAmount());
            $payment->setMin($paymentMin);
        } else {
            $payout->setMin($payoutMin);
            Payout::calculateAmount($pair, $payoutMin);
            $payment->setMin($payment->getAmount());
        }
    }

    public static function calculateMax(Pair $pair): void
    {
        $payment = $pair->getPayment();
        $payout = $pair->getPayout();

        $paymentMax = $payment->getFee()->getMax();
        $payoutMax = $payout->getFee()->getMax();

        Payment::calculateAmount($pair, $paymentMax);

        if ($payoutMax < $pair->getPayout()->getAmount()) {
            $payout->setMax($payoutMax);
            Payout::calculateAmount($pair, $payoutMax);
            $payment->setMax($payment->getAmount());
        } else {
            $payment->setMax($paymentMax);
            Payment::calculateAmount($pair, $paymentMax);
            $payout->setMax($payout->getAmount());
        }
    }
}