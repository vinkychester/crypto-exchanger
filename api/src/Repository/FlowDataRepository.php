<?php

namespace App\Repository;

use App\Entity\FlowData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FlowData|null find($id, $lockMode = null, $lockVersion = null)
 * @method FlowData|null findOneBy(array $criteria, array $orderBy = null)
 * @method FlowData[]    findAll()
 * @method FlowData[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FlowDataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FlowData::class);
    }

    // /**
    //  * @return FlowData[] Returns an array of FlowData objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FlowData
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
