<?php


namespace App\Resolver\Mutation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Service\BankDetailBuilder\BankDetailBuilder;
use App\Service\Calculation\src\Course\Course;
use App\Service\RequisitionFeeBuilder\RequisitionFeeBuilder;

/**
 * Class RequisitionMutationResolver
 * @package App\Resolver\Mutation
 */
class RequisitionMutationResolver implements MutationResolverInterface
{

    private \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * RequisitionMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     */
    public function __construct(\Doctrine\ORM\EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Requisition|null $item
     * @param array $context
     * @return Requisition|null
     * @throws \Exception
     */
    public function __invoke($item, array $context): ?Requisition
    {
        $args = $context['args']['input'];

        $paymentAttributes = $args['paymentAttributes'];
        $payoutAttributes = $args['payoutAttributes'];

        $savePaymentBankDetails = $args['savePaymentBankDetails'];
        $savePayoutBankDetails = $args['savePayoutBankDetails'];

        $pair = $item->getPair();
        $currencyTag = $pair->getPayment()->getCurrency()->getTag();

        // SET INITIAL COURSE
        $item->setCourse($currencyTag === Currency::TYPE_CURRENCY ? 1 / Course::calculate($pair) : Course::calculate($pair));
        $item->setPairPercent($pair->getPercent());

        // CREATE PAYMENT CP ATTRIBUTES
        if ($paymentAttributes) {
            (new BankDetailBuilder($this->entityManager))
                ->setBankDetails($item, $paymentAttributes, Pair::PAYMENT, $savePaymentBankDetails)
                ->storeBankDetails()
            ;
        }

        // CREATE PAYOUT CP ATTRIBUTES
        if ($payoutAttributes) {
            (new BankDetailBuilder($this->entityManager))
                ->setBankDetails($item, $payoutAttributes, Pair::PAYOUT, $savePayoutBankDetails)
                ->storeBankDetails()
            ;
        }

        // SET INITIAL PAYMENT FEE
        (new RequisitionFeeBuilder($this->entityManager))
            ->setFee($item, $item->getPair()->getPayment())
            ->storeItem();

        // SET INITIAL PAYOUT FEE
        (new RequisitionFeeBuilder($this->entityManager))
            ->setFee($item, $item->getPair()->getPayout())
            ->storeItem();

        return $item;
    }
}