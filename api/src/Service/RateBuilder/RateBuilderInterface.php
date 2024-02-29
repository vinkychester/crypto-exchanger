<?php

namespace App\Service\RateBuilder;

interface RateBuilderInterface
{
    /**
     * @param $rates
     * @return $this
     */
    public function setItems($rates): static;

    /**
     * @return $this
     */
    public function storeItems(): static;
}