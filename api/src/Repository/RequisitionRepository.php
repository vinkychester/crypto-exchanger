<?php

namespace App\Repository;

use App\Entity\Currency;
use App\Entity\Requisition;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @method Requisition|null find($id, $lockMode = null, $lockVersion = null)
 * @method Requisition|null findOneBy(array $criteria, array $orderBy = null)
 * @method Requisition[]    findAll()
 * @method Requisition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequisitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Requisition::class);
    }

    /**
     * @param $interval
     * @param $type
     * @param $tag
     * @return mixed
     * @throws Exception
     */
    public function requisitionTimer($interval, $type, $tag): mixed
    {
        $date = new DateTime($interval);
        $date->setTime(date('H'), date('i'), '00');
        $start_day = $date->getTimestamp();
        $date->setTime(date('H'), date('i') + 1, '00');
        $end_day = $date->getTimestamp();

        $queryBuilder = $this->createQueryBuilder('requisition');

        $queryBuilder->where('requisition.status = :status')
            ->innerJoin('requisition.pair', 'pair')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere(
                $queryBuilder->expr()->orX(
                    $queryBuilder->expr()->eq('payoutCurrency.tag', ':tag'),
                    $queryBuilder->expr()->eq('paymentCurrency.tag', ':tag')
                )
            );

        $queryBuilder->andWhere('requisition.createdAt >= :date_start')
            ->andWhere('requisition.createdAt <= :date_end')
            ->setParameters(
                [
                    'date_start' => $start_day,
                    'date_end'   => $end_day,
                    'status'     => Requisition::STATUS_NEW,
                    'tag'        => $tag,
                ]
            );

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @return mixed
     */
    public function requisitionTimerFiveDays(): mixed
    {
        $date = new DateTime("-5 days");
        $date->setTime(date('H'), date('i'), '00');
        $start_day = $date->getTimestamp();
        $date->setTime(date('H'), date('i') + 1, '00');
        $end_day = $date->getTimestamp();

        $queryBuilder = $this->createQueryBuilder('requisition');

        $queryBuilder->where($queryBuilder->expr()->notIn('requisition.status', ':status'))
            ->innerJoin('requisition.pair', 'pair')
            ->innerJoin('requisition.invoices', 'invoice')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere('invoice.direction = :payment')
            ->andWhere(
                $queryBuilder->expr()->orX(
                    $queryBuilder->expr()->eq('payoutCurrency.tag', ':tag'),
                    $queryBuilder->expr()->eq('paymentCurrency.tag', ':tag')
                )
            )
            ->andWhere('requisition.createdAt >= :date_start')
            ->andWhere('requisition.createdAt <= :date_end')
            ->setParameters(
                [
                    'date_start'     => $start_day,
                    'date_end'       => $end_day,
                    'status'         => [Requisition::STATUS_FINISHED, Requisition::STATUS_CANCELED, Requisition::STATUS_ERROR, Requisition::STATUS_DISABLED],
                    'tag'            => Currency::TYPE_CRYPTO,
                    'payment'        => "payment",
                ]
            );
        return $queryBuilder->getQuery()->getResult();
    }
    // /**
    //  * @return Requisition[] Returns an array of Requisition objects
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
    public function findOneBySomeField($value): ?Requisition
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
