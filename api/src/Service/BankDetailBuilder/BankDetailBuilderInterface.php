<?php


namespace App\Service\BankDetailBuilder;

use App\Entity\Requisition;

/**
 * Interface BankDetailBuilderInterface
 * @package App\Service\BankDetailBuilder
 */
interface BankDetailBuilderInterface
{
    /**
     * @param Requisition $requisition
     * @param array $attributes
     * @param string $direction
     * @param bool $isSaveDetails
     */
    public function setBankDetails(Requisition $requisition, array $attributes, string $direction, bool $isSaveDetails): static;

    /**
     * @return $this
     */
    public function storeBankDetails(): static;
}