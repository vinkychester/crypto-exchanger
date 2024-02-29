<?php

namespace App\Repository;

use App\Entity\FeedbackDetail;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FeedbackDetail|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedbackDetail|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedbackDetail[]    findAll()
 * @method FeedbackDetail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedbackDetailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedbackDetail::class);
    }

    // /**
    //  * @return FeedbackDetail[] Returns an array of FeedbackDetail objects
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
    public function findOneBySomeField($value): ?FeedbackDetail
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
