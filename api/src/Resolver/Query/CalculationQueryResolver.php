<?php


namespace App\Resolver\Query;


use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Pair;
use App\Service\Calculation\src\CalculationService;
use App\Service\Calculation\src\Limits\Limits;

/**
 * Class CalculationQueryResolver
 * @package App\Resolver
 */
class CalculationQueryResolver implements QueryItemResolverInterface
{
    /**
     * @param Pair|null $item
     * @param array $context
     * @return Pair|null
     */
    public function __invoke($item, array $context): ?Pair
    {
        $args = $context['args'];
        $direction = $args['direction'] ?? "payment";
        $amount = $args['amount'] ?? null;

        $fieldName = $direction === "payment" ? "paymentAmount" : "payoutAmount";

        Limits::calculateMin($item);
        Limits::calculateMax($item);
        CalculationService::calculate($direction)->calculateAmount($item, $amount);

        return $item;
    }
}