<?php


namespace App\Service\Calculation\src\States;


use App\Entity\Pair;
use App\Service\Calculation\src\Course\Course;
use App\Service\Calculation\src\Limits\Limits;

class Payout implements StateInterface
{
    /**
     * @param Pair $pair
     * @param float|null $amount
     * @param float|null $percent
     */
    public static function calculateAmount(Pair $pair, float $amount = null, float $percent = null): void
    {
        $payment = $pair->getPayment();
        $payout = $pair->getPayout();

        if ($amount === null) {
            Limits::calculateMin($pair);
            $amount = $pair->getPayout()->getMin();
        }

        $payout->setAmount($amount);

        $course = Course::calculate($pair, $percent);

        $paymentPercent = $payment->getFee()->getPercent();
        $paymentConstant = $payment->getFee()->getConstant();

        $payoutPercent = $payout->getFee()->getPercent();
        $payoutConstant = $payout->getFee()->getConstant();

        $currencyTmp = ($amount + $payoutConstant) / (1 - $payoutPercent / 100);
        $cryptocurrencyTmp = $currencyTmp / $course;

        $payment->setAmount(($cryptocurrencyTmp + $paymentConstant) / (1 - $paymentPercent / 100));
    }
}