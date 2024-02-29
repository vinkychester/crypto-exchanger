<?php


namespace App\Service\Calculation\src\States;


use App\Entity\Pair;

/**
 * Interface StateInterface
 * @package App\Service\Calculation\src\States
 */
interface StateInterface
{
    /**
     * @param Pair $pair
     * @param float|null $amount
     * @param float|null $percent
     */
    public static function calculateAmount(Pair $pair, float $amount = null, float $percent = null): void;
}