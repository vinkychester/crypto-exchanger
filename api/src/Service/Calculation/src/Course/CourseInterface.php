<?php


namespace App\Service\Calculation\src\Course;


use App\Entity\Pair;

/**
 * Interface CourseInterface
 * @package App\Service\Calculation\src\Course
 */
interface CourseInterface
{
    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float
     */
    public static function calculate(Pair $pair, float $percent = null): float;

    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float
     */
    public static function calculateLastFee(Pair $pair, float $percent = null): float;

    /**
     * @param Pair $pair
     * @param float|null $percent
     * @return float|null
     */
    public static function calculateSurcharge(Pair $pair, float $percent = null): ?float;
}