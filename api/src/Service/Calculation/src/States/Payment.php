<?php


namespace App\Service\Calculation\src\States;


use App\Entity\Pair;
use App\Service\Calculation\src\Course\Course;
use App\Service\Calculation\src\Limits\Limits;

/**
 * Class Payment
 * @package App\Service\Calculation\src\States
 */
class Payment implements StateInterface
{
    /**
     * @param Pair $pair
     * @param float|null $amount
     * @param float|null $percent
     */
    public static function calculateAmount(Pair $pair, float $amount = null, float $percent = null): void
    {
        if ($amount === null) {
            Limits::calculateMin($pair);
            $amount = $pair->getPayment()->getAmount();
        } else {
            $pair->getPayment()->setAmount($amount);
        }

        $course = Course::calculate($pair, $percent);

        $paymentPercent = $pair->getPayment()->getFee()->getPercent();
        $paymentConstant = $pair->getPayment()->getFee()->getConstant();

        $payoutPercent = $pair->getPayout()->getFee()->getPercent();
        $payoutConstant = $pair->getPayout()->getFee()->getConstant();

        $currencyTmp = $amount - ($amount * $paymentPercent) / 100 - $paymentConstant;
        $cryptocurrencyTmp = $currencyTmp * $course;

        $pair->getPayout()->setAmount($cryptocurrencyTmp * (1 - $payoutPercent / 100) - $payoutConstant);
    }
}