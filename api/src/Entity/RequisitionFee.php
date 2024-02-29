<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RequisitionFeeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=RequisitionFeeRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['requisition-fee:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['requisition-fee:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ]
    ],
    attributes: ['pagination_enabled' => false]
)]
class RequisitionFee
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?float $percent;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?float $constant;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?float $rate;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?float $pairPercent;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?float $paymentSystemPrice;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=8)
     * @Groups({"requisition:item_query", "requisition-fee:item_query"})
     */
    private ?string $type;

    /**
     * @var Requisition|null
     * @ORM\ManyToOne(targetEntity=Requisition::class, inversedBy="requisitionFees")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Requisition $requisition;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getPercent(): ?float
    {
        return $this->percent;
    }

    /**
     * @param float $percent
     * @return $this
     */
    public function setPercent(float $percent): self
    {
        $this->percent = $percent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getConstant(): ?float
    {
        return $this->constant;
    }

    /**
     * @param float $constant
     * @return $this
     */
    public function setConstant(float $constant): self
    {
        $this->constant = $constant;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getRate(): ?float
    {
        return $this->rate;
    }

    /**
     * @param float $rate
     * @return $this
     */
    public function setRate(float $rate): self
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPairPercent(): ?float
    {
        return $this->pairPercent;
    }

    /**
     * @param float $pairPercent
     * @return $this
     */
    public function setPairPercent(float $pairPercent): self
    {
        $this->pairPercent = $pairPercent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPaymentSystemPrice(): ?float
    {
        return $this->paymentSystemPrice;
    }

    /**
     * @param float $paymentSystemPrice
     * @return $this
     */
    public function setPaymentSystemPrice(float $paymentSystemPrice): self
    {
        $this->paymentSystemPrice = $paymentSystemPrice;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return $this
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Requisition|null
     */
    public function getRequisition(): ?Requisition
    {
        return $this->requisition;
    }

    /**
     * @param Requisition|null $requisition
     * @return $this
     */
    public function setRequisition(?Requisition $requisition): self
    {
        $this->requisition = $requisition;

        return $this;
    }
}
