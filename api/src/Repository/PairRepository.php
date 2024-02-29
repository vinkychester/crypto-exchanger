<?php

namespace App\Repository;

use App\Entity\Pair;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Pair|null find($id, $lockMode = null, $lockVersion = null)
 * @method Pair|null findOneBy(array $criteria, array $orderBy = null)
 * @method Pair[]    findAll()
 * @method Pair[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PairRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pair::class);
    }

    /**
     * @param array $criteria
     * @return mixed
     */
    public function getSimilarPairUnits(array $criteria): mixed
    {
        $payment = $criteria["payment"];
        $payout = $criteria["payout"];

        $qb = $this->createQueryBuilder('p');
        $qb->innerJoin('p.payment', 'f')
            ->innerJoin('p.payout', 'k')
            ->andWhere($qb->expr()->eq('f.id', $payment->getId()))
            ->andWhere($qb->expr()->eq('k.id', $payout->getId()));


        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }
}
