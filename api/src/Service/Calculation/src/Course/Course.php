<?php


namespace App\Service\Calculation\src\Course;


use App\Entity\Currency;
use App\Entity\Pair;

/**
 * Class Course
 * @package App\Service\Calculation\src\Course
 */
class Course implements CourseInterface
{
    /**
     * @param string $tag
     * @param float $rate
     * @return float|int
     */
    protected static function getRate(string $tag, float $rate): float|int
    {
        if ($tag === Currency::TYPE_CURRENCY) {
            return 1 / $rate;
        }

        return $rate;
    }

    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float
     */
    public static function calculate(Pair $pair, float $percent = null): float
    {
        $paymentCurrency = $pair->getPayment()->getCurrency();
        $payoutCurrency = $pair->getPayout()->getCurrency();

        $paymentRate = self::getRate($paymentCurrency->getTag(), $paymentCurrency->getPaymentRate());
        $payoutRate = self::getRate($payoutCurrency->getTag(), $payoutCurrency->getPayoutRate());

        $lastFee = self::calculateLastFee($pair, $percent);

        return $paymentRate / $payoutRate * ((100 - $lastFee) / 100);
    }

    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float
     */
    public static function calculateLastFee(Pair $pair, float $percent = null): float
    {
        $paymentPrice = $pair->getPayment()->getPrice();
        $payoutPrice = $pair->getPayout()->getPrice();

        $pairPercent = $pair->getPercent();

        if ($percent) {
            $pairPercent = $percent;
        }

        return $pairPercent - $paymentPrice + $payoutPrice;
    }

    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float|null
     */
    public static function calculateSurcharge(Pair $pair, float $percent = null): ?float
    {
        $lastFee = self::calculateLastFee($pair, $percent);

        $inPercent = $pair->getPayment()->getFee()->getPercent();
        $outPercent = $pair->getPayout()->getFee()->getPercent();

        return $lastFee + $inPercent + $outPercent;
    }
}