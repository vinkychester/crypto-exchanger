<?php


namespace App\Service\Calculation\src\Rate;


use App\Entity\Pair;

/**
 * Interface RateInterface
 * @package App\Service\Calculation\src\Rate
 */
interface RateInterface
{
    /**
     * @param Pair $pair
     * @param string $direction
     * @return mixed
     */
    public static function calculate(Pair $pair, string $direction): mixed;
}