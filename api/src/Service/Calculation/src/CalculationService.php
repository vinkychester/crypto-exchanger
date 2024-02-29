<?php


namespace App\Service\Calculation\src;


use App\Service\Calculation\src\States\Payment;
use App\Service\Calculation\src\States\Payout;
use JetBrains\PhpStorm\Pure;
use stdClass;

/**
 * Class CalculationService
 * @package App\Service\Calculation\src
 */
class CalculationService
{
    /**
     * @return stdClass
     */
    #[Pure] public static function getType(): stdClass
    {
        $list = new stdClass();

        $list->payment = new Payment();
        $list->payout = new Payout();

        return $list;
    }

    /**
     * @param string $type
     * @return mixed
     */
    #[Pure] public static function calculate(string $type): mixed
    {
        $type = strtolower($type);

        return self::getType()->$type;
    }
}