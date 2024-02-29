<?php

namespace App\Repository;

use App\Entity\PairUnit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PairUnit|null find($id, $lockMode = null, $lockVersion = null)
 * @method PairUnit|null findOneBy(array $criteria, array $orderBy = null)
 * @method PairUnit[]    findAll()
 * @method PairUnit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PairUnitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PairUnit::class);
    }

    /**
     * @param $baseFee
     * @param string $direction
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findPairUnit($baseFee, string $direction): mixed
    {
        return $this->createQueryBuilder("pairUnit")
            ->innerJoin("pairUnit.currency", "currency")
            ->innerJoin("currency.service", "service")
            ->innerJoin("pairUnit.paymentSystem", "payment_system")
            ->where("currency.asset = :asset")
            ->andWhere("service.name = :service_name")
            ->andWhere("payment_system.name = :payment_system_name")
            ->andWhere("pairUnit.direction = :direction")
            ->setParameter("asset", $baseFee["currency"]["asset"])//$baseFee["currency"]["asset"]
            ->setParameter("service_name", $baseFee["service"]["name"])//$baseFee["service"]["name"]
            ->setParameter("payment_system_name", $baseFee["paymentSystem"]["name"])//$baseFee["paymentSystem"]["name"]
            ->setParameter("direction", $direction)
            ->getQuery()
            ->getOneOrNullResult();

    }
}
