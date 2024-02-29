<?php

namespace App\Service\RateBuilder;

use App\Entity\Currency;
use Doctrine\Common\Collections\ArrayCollection;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Rate\getAll;

class RateBuilder implements RateBuilderInterface
{
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * @var ArrayCollection
     */
    protected ArrayCollection $availableCurrencies;

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     */
    public function __construct(\Doctrine\ORM\EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param array $currencies
     * @return $this
     */
    public function setAvailableCurrencies(array $currencies): static
    {
        $this->availableCurrencies = new ArrayCollection($currencies);

        return $this;
    }

    /**
     * @param $rates
     * @return $this
     */
    public function setItems($rates): static
    {
        foreach ($rates as $rate) {
            foreach ($this->availableCurrencies as $availableCurrency) {
                if ($availableCurrency->getService()->getTag() === $rate->getService()->getTag() && $availableCurrency->getAsset() === $rate->getCurrency()->getAsset()) {
                    $availableCurrency->setRate($rate->getRate())
                    ->setPaymentRate($rate->getPurchase())
                    ->setPayoutRate($rate->getSelling());

                    $this->entityManager->persist($availableCurrency);
                }
            }
//            if (!$rate instanceof getAll) {
//                continue;
//            }
//
//            if ($this->availableCurrencies->count()
//                && !$currencyForUpdate = $this->availableCurrencies->filter(
//                    /** @var Currency $item */
//                    function ($item) use ($rate) {
//                        if ($item->getAsset() === $rate->getCurrency()->getAsset()
//                            && $item->getService()->getTitle() === $rate->getService()->getTitle()
//                        ) {
//                            return !($item->getRate() == $rate->getRate()
//                                || $item->getPaymentRate() == $rate->getPurchase()
//                                || $item->getPayoutRate() == $rate->getSelling());
//                        }
//
//                        return false;
//                    }
//                )
//            ) {
//                continue;
//            }
//            dd($currencyForUpdate);
//            if (!$currencyForUpdate->isEmpty()) {
//                $currentCurrency = $currencyForUpdate->first();

//                $currentCurrency->setRate($rate->getRate())
//                    ->setPaymentRate($rate->getPurchase())
//                    ->setPayoutRate($rate->getSelling());

//                $this->entityManager->persist($currentCurrency);

            }
//        }

        return $this;
    }

    /**
     * @return $this
     */
    public function storeItems(): static
    {
        $this->entityManager->flush();

        return $this;
    }


}