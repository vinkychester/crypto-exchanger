<?php


namespace App\Service\RequisitionFeeBuilder;


use App\Entity\PairUnit;
use App\Entity\Requisition;
use App\Entity\RequisitionFee;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class RequisitionFeeBuilder
 * @package App\Service\RequisitionFeeBuilder
 */
class RequisitionFeeBuilder implements RequisitionFeeBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * RequisitionFeeBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Requisition $requisition
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function setFee(Requisition $requisition, PairUnit $pairUnit): static
    {
        $rate = "get" . ucfirst($pairUnit->getDirection()) . "Rate";

        /** @var RequisitionFee $fee */
        $fee = $this->entityManager->getRepository(RequisitionFee::class)->findOneBy([
            'requisition' => $requisition, 'type' => $pairUnit->getDirection()
        ]);

        if (!$fee) {
            $fee = new RequisitionFee();
            $fee
                ->setType($pairUnit->getDirection())
                ->setRequisition($requisition);
        }

        $fee
            ->setPercent($pairUnit->getFee()->getPercent())
            ->setPairPercent($requisition->getPair()->getPercent())
            ->setConstant($pairUnit->getFee()->getConstant())
            ->setRate($pairUnit->getCurrency()->$rate())
            ->setPaymentSystemPrice($pairUnit->getPrice());

        $this->entityManager->persist($fee);

        return $this;
    }

    /**
     * @return $this
     */
    public function storeItem(): static
    {
        $this->entityManager->flush();

        return $this;
    }
}