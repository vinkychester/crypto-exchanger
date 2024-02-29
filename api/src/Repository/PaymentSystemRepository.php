<?php

namespace App\Repository;

use App\Entity\PaymentSystem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PaymentSystem|null find($id, $lockMode = null, $lockVersion = null)
 * @method PaymentSystem|null findOneBy(array $criteria, array $orderBy = null)
 * @method PaymentSystem[]    findAll()
 * @method PaymentSystem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PaymentSystemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PaymentSystem::class);
    }
}
