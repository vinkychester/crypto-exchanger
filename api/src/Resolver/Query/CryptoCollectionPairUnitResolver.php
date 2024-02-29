<?php


namespace App\Resolver\Query;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Pair;
use App\Entity\PairUnit;
use App\Service\Calculation\src\Course\Course;
use App\Service\Calculation\src\Rate\Rate;

/**
 * Class CryptoCollectionPairUnitResolver
 * @package App\Resolver\Query
 */
class CryptoCollectionPairUnitResolver implements QueryCollectionResolverInterface
{
    private \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * CryptoCollectionPairUnitResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     */
    public function __construct( \Doctrine\ORM\EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param PairUnit $collection
     * @param array $context
     * @return iterable
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        /** @var PairUnit $unit */
        $unit = $this->entityManager->getRepository(PairUnit::class)->find($context['args']['selected']);
        $repository = $this->entityManager->getRepository(Pair::class);
        foreach ($collection as $item) {
            /** @var Pair $pairA */
            $pairA = $repository->findOneBy(['payment' => $unit, 'payout' => $item]);
            if ($pairA) {
                $item->setSurcharge(Course::calculate($pairA));
                $item->setIsRateExchange(true);
                $item->setExchangeRate(Rate::calculate($pairA, $item->getDirection()));
            }
            /** @var Pair $pairB */
            $pairB = $repository->findOneBy(['payment' => $item, 'payout' => $unit]);
            if ($pairB) {
                $item->setSurcharge(Course::calculate($pairB));
                $item->setIsRateExchange(true);
                $item->setExchangeRate(Rate::calculate($pairB, $item->getDirection()));
            }
        }
        return $collection;
    }
}