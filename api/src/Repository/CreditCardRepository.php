<?php

namespace App\Repository;

use App\Entity\CreditCard;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CreditCard|null find($id, $lockMode = null, $lockVersion = null)
 * @method CreditCard|null findOneBy(array $criteria, array $orderBy = null)
 * @method CreditCard[]    findAll()
 * @method CreditCard[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CreditCardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CreditCard::class);
    }

    /**
     * @param array $criteria
     * @return mixed
     */
    public function uniqueCreditCard(array $criteria): mixed
    {
        // add or on status if need
        $creditCard = $criteria['cardNumber'];
        $qb = $this->createQueryBuilder('credit_card');
        $qb->where("credit_card.cardNumber = :cardNumber")
            ->andWhere("credit_card.status = :status_verified or credit_card.status = :status_approved")
            ->setParameter("cardNumber", $creditCard)
            ->setParameter("status_verified", CreditCard::NOT_VERIFIED)
            ->setParameter("status_approved", CreditCard::VERIFIED);
        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (\Doctrine\ORM\NonUniqueResultException $e) {
            return false;
        }
    }
}
