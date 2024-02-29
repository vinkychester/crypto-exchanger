<?php

namespace App\Repository;

use App\Entity\FeedbackMessage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FeedbackMessage|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedbackMessage|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedbackMessage[]    findAll()
 * @method FeedbackMessage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedbackMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedbackMessage::class);
    }

    // /**
    //  * @return FeedbackMessage[] Returns an array of FeedbackMessage objects
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
    public function findOneBySomeField($value): ?FeedbackMessage
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
