<?php


namespace App\Service\BankDetailBuilder;


use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Entity\Requisition;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class BankDetailBuilder
 * @package App\Service\BankDetailBuilder
 */
class BankDetailBuilder implements BankDetailBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * BankDetailBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @throws \Exception
     */
    public function setBankDetails(Requisition $requisition, array $attributes, string $direction, bool $isSaveDetails): static
    {
        $value = "get" . ucfirst($direction);
        $pairUnit = $requisition->getPair()->$value();

        $bankDetail = new BankDetail();
        $bankDetail
            ->setPairUnit($pairUnit)
            ->setDirection($direction)
            ->setTitle($pairUnit->getPaymentSystem()->getName() . " " . $pairUnit->getCurrency()->getAsset() . " (" . bin2hex(random_bytes(3)) . ")")
            ->addRequisition($requisition);

        if ($isSaveDetails) {
            $bankDetail->setClient($requisition->getClient());
        }

        $em = $this->entityManager;
        array_walk($attributes, static function ($value) use ($bankDetail, $requisition, $em) {
            $attribute = new Attribute();
            $attribute
                ->setName($value['name'])
                ->setValue($value['value'])
                ->setIsHidden($value['isHidden'])
                ->setInformation($value['information'] ?? "")
                ->setBankDetail($bankDetail);

            $em->persist($attribute);
        });

        $em->persist($bankDetail);

        return $this;
    }

    /**
     * @return $this
     */
    public function storeBankDetails(): static
    {
        $this->entityManager->flush();

        return $this;
    }
}