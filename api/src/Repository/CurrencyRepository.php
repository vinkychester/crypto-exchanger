<?php

namespace App\Repository;

use App\Entity\Currency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Currency|null find($id, $lockMode = null, $lockVersion = null)
 * @method Currency|null findOneBy(array $criteria, array $orderBy = null)
 * @method Currency[]    findAll()
 * @method Currency[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CurrencyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Currency::class);
    }

    /**
     * @param $serviceName
     * @param $asset
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findCurrency($serviceName, $asset): mixed
    {
        return $this->createQueryBuilder('c')
            ->where('c.asset = :asset')
            ->join('c.service', 'service')
            ->andWhere('service.tag = :serviceName')
            ->setParameters(
                [
                    'asset'       => $asset,
                    'serviceName' => $serviceName
                ]
            )
            ->getQuery()
            ->getOneOrNullResult();
    }
}
