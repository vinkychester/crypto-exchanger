<?php

namespace App\Service\Calculation\src\Limits;

use App\Entity\Pair;
use Calculation\Utils\Exchange\PairInterface;

/**
 * Interface LimitsInterface
 * @package App\Service\Calculation\src\Limits
 */
interface LimitsInterface
{
    public static function calculateMin(Pair $pair): void;

    public static function calculateMax(Pair $pair): void;
}
