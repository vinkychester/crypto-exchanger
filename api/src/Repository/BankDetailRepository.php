<?php

namespace App\Repository;

use App\Entity\BankDetail;
use App\Entity\PairUnit;
use App\Entity\Requisition;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BankDetail|null find($id, $lockMode = null, $lockVersion = null)
 * @method BankDetail|null findOneBy(array $criteria, array $orderBy = null)
 * @method BankDetail[]    findAll()
 * @method BankDetail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BankDetailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BankDetail::class);
    }

    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findBankDetailsByParams(
        Requisition $requisition,
        PairUnit $pairUnit,
        string $direction
    ){
        return $this->createQueryBuilder("bank_detail")
            ->join("bank_detail.requisitions", "requisitions")
            ->where('bank_detail.direction = :direction')
            ->andWhere("bank_detail.pairUnit = :pair_unit")
            ->andWhere("requisitions = :requisition")
            ->setParameters([
                'direction' => $direction,
                'pair_unit' => $pairUnit,
                'requisition' => $requisition
            ])
            ->getQuery()->getOneOrNullResult();
    }

    /**
     * @param User $client
     * @param PairUnit $pairUnit
     * @param string $wallet
     * @param string $direction
     * @return int|mixed|string|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findWallet(User $client, PairUnit $pairUnit, string $wallet, string $direction)
    {
        return $this->createQueryBuilder("bank_detail")
            ->join("bank_detail.attributes", "attributes")
            ->where("attributes.name = :name")
            ->andWhere("attributes.value = :value")
            ->andWhere("bank_detail.client = :client")
            ->andWhere("bank_detail.direction = :direction")
            ->andWhere("bank_detail.pairUnit = :pairUnit")
            ->setParameters(
                [
                    "name"      => "wallet",
                    "value"     => $wallet,
                    "client"    => $client,
                    "direction" => $direction,
                    "pairUnit"  => $pairUnit
                ]
            )
            ->getQuery()->getOneOrNullResult();
    }
}
