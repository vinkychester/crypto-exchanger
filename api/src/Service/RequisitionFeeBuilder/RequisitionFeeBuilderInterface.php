<?php


namespace App\Service\RequisitionFeeBuilder;

use App\Entity\PairUnit;
use App\Entity\Requisition;

/**
 * Interface RequisitionFeeBuilderInterface
 * @package App\Service\RequisitionFeeBuilder
 */
interface RequisitionFeeBuilderInterface
{
    /**
     * @param Requisition $requisition
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function setFee(Requisition $requisition, PairUnit $pairUnit): static;

    /**
     * @return $this
     */
    public function storeItem(): static;
}