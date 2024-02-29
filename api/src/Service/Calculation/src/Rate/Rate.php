<?php


namespace App\Service\Calculation\src\Rate;


use App\Entity\Pair;
use App\Service\Calculation\src\Course\Course;

/**
 * Class Rate
 * @package App\Service\Calculation\src\Rate
 */
class Rate implements RateInterface
{
    /**
     * @param Pair $pair
     * @param string $direction
     * @return int|float
     */
    public static function calculate(Pair $pair, string $direction): int|float
    {
        $course = $direction === Pair::PAYMENT ? Course::calculate($pair) : 1 / Course::calculate($pair);

        $paymentPercent = $pair->getPayment()->getFee()->getPercent();
        $payoutPercent = $pair->getPayout()->getFee()->getPercent();

        return ((100 + $paymentPercent) / 100) * ($course * ((100 + $payoutPercent) / 100));
    }
}