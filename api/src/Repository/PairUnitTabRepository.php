<?php

namespace App\Repository;

use App\Entity\PairUnitTab;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PairUnitTab|null find($id, $lockMode = null, $lockVersion = null)
 * @method PairUnitTab|null findOneBy(array $criteria, array $orderBy = null)
 * @method PairUnitTab[]    findAll()
 * @method PairUnitTab[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PairUnitTabRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PairUnitTab::class);
    }
}
