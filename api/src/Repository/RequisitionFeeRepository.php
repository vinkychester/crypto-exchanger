<?php

namespace App\Repository;

use App\Entity\RequisitionFee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RequisitionFee|null find($id, $lockMode = null, $lockVersion = null)
 * @method RequisitionFee|null findOneBy(array $criteria, array $orderBy = null)
 * @method RequisitionFee[]    findAll()
 * @method RequisitionFee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequisitionFeeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RequisitionFee::class);
    }

    // /**
    //  * @return RequisitionFee[] Returns an array of RequisitionFee objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?RequisitionFee
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
