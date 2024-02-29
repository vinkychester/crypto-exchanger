<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\PairRepository;
use App\Resolver\Query\CalculationQueryResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity
 * @ORM\Entity(repositoryClass=PairRepository::class)
 * @UniqueEntity(
 *      fields={"payment", "payout"},
 *      repositoryMethod="getSimilarPairUnits",
 *      message="The payment pair already exists",
 *      groups={"pair:create"}
 * )
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['pair:item_query']],
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['pair:collection_query']],
        ],
        'update' => ['denormalization_context' => ['groups' => ['pair:update-mutation']]],
        'create' => [
            'denormalization_context' => ['groups' => ['pair:crate-mutation']],
            'validation_groups'       => ['pair:create']
        ],
        'calculationQuery' => [
            'item_query' => CalculationQueryResolver::class,
            'args' => [
                'id' => ['type' => 'ID!'],
                'direction' => ['type' => 'String'],
                'amount' => ['type' => 'Float'],
            ]
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read' => false,
            'output' => false
        ]
    ],
    attributes: [
        'pagination_type' => 'page',
    ]
)]
#[ApiFilter(BooleanFilter::class, properties: ['isActive'])]
#[ApiFilter(SearchFilter::class, properties: [
    'payment.currency.asset' => 'partial',
    'payout.currency.asset' => 'partial',
    'payment.paymentSystem.name' => 'exact',
    'payout.paymentSystem.name' => 'exact',
    'payment.currency.service.tag' => 'exact',
    'payout.currency.service.tag' => 'exact',
])]
#[ApiFilter(BooleanFilter::class, properties: ['isActive'])]
#[ApiFilter(RangeFilter::class, properties: ['percent'])]
class Pair
{
    public const PAYMENT = "payment";
    public const PAYOUT  = "payout";

    /**
     * @var ?int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var ?float
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair:collection_query",
     *     "pair:update-mutation",
     *     "pair:crate-mutation"
     * })
     */
    private ?float $percent;

    /**
     * @var ?float
     */
    private ?float $paymentRate;

    /**
     * @var ?float
     */
    private ?float $payoutRate;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "pair:collection_query",
     *     "pair:update-mutation",
     * })
     */
    private ?bool $isActive;

    /**
     * @var ?PairUnit
     * @ORM\ManyToOne(targetEntity=PairUnit::class, inversedBy="paymentPairs")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:crate-mutation",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?PairUnit $payment;

    /**
     * @var ?PairUnit
     * @ORM\ManyToOne(targetEntity=PairUnit::class, inversedBy="payoutPairs")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:crate-mutation",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?PairUnit $payout;

    /**
     * @ORM\OneToMany(targetEntity=Requisition::class, mappedBy="pair")
     */
    private $requisitions;

    /**
     * Pair constructor.
     */
    public function __construct()
    {
        $this->isActive = false;
        $this->percent = 0;
        $this->requisitions = new ArrayCollection();
    }

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
    public function getPaymentRate(): ?float
    {
        return $this->paymentRate;
    }

    /**
     * @param float $paymentRate
     * @return $this
     */
    public function setPaymentRate(float $paymentRate): self
    {
        $this->paymentRate = $paymentRate;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPayoutRate(): ?float
    {
        return $this->payoutRate;
    }

    /**
     * @param float $payoutRate
     * @return $this
     */
    public function setPayoutRate(float $payoutRate): self
    {
        $this->payoutRate = $payoutRate;

        return $this;
    }

    /**
     * @return PairUnit|null
     */
    public function getPayment(): ?PairUnit
    {
        return $this->payment;
    }

    /**
     * @param PairUnit|null $payment
     * @return $this
     */
    public function setPayment(?PairUnit $payment): self
    {
        $this->payment = $payment;

        return $this;
    }

    /**
     * @return PairUnit|null
     */
    public function getPayout(): ?PairUnit
    {
        return $this->payout;
    }

    /**
     * @param PairUnit|null $payout
     * @return $this
     */
    public function setPayout(?PairUnit $payout): self
    {
        $this->payout = $payout;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     * @return $this
     */
    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * @return Collection|Requisition[]
     */
    public function getRequisitions(): Collection
    {
        return $this->requisitions;
    }

    public function addRequisition(Requisition $requisition): self
    {
        if (!$this->requisitions->contains($requisition)) {
            $this->requisitions[] = $requisition;
            $requisition->setPair($this);
        }

        return $this;
    }

    public function removeRequisition(Requisition $requisition): self
    {
        if ($this->requisitions->removeElement($requisition)) {
            // set the owning side to null (unless already changed)
            if ($requisition->getPair() === $this) {
                $requisition->setPair(null);
            }
        }

        return $this;
    }
}
