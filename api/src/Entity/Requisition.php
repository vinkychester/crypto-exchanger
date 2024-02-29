<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\RequisitionRepository;
use App\Resolver\Mutation\RequisitionMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use JetBrains\PhpStorm\Pure;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=RequisitionRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['requisition:item_query']],
            'security' => "is_granted('ROLE_CLIENT') or is_granted('ROLE_ADMIN')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['requisition:collection_query']],
            'security' => "is_granted('ROLE_CLIENT') or is_granted('ROLE_ADMIN')"
        ],
        'update' => ['denormalization_context' => ['groups' => ['requisition:update-mutation']]],
        'create' => [
            'mutation' => RequisitionMutationResolver::class,
            'denormalization_context' => ['groups' => ['requisition:mutation_create']],
            'security' => "is_granted('ROLE_CLIENT')",
            'args' => [
                'pair' => ['type' => 'String!'],
                'paymentAmount' => ['type' => 'Float!'],
                'payoutAmount' => ['type' => 'Float!'],
                'client' => ['type' => 'String!'],
                'paymentAttributes' => ['type' => 'Iterable!'],
                'payoutAttributes' => ['type' => 'Iterable!'],
                'savePaymentBankDetails' => ['type' => 'Boolean!'],
                'savePayoutBankDetails' => ['type' => 'Boolean!'],
            ]
        ]
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ]
    ],
    attributes: [
        'pagination_type' => 'page',
        'order' => ['createdAt' => 'DESC']
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'id' => 'partial',
    'client.firstname' => 'partial',
    'client.lastname' => 'partial',
    'client.email' => 'partial',
    'bankDetails.attributes.value' => 'partial',
    'client.id' => 'exact',
    'status' => 'exact',
    'pair.payout.paymentSystem.subName' => 'exact',
    'pair.payment.paymentSystem.name' => 'exact',
    'pair.payment.paymentSystem.subName' => 'exact',
    'bankDetails.attributes.name' => 'exact',
])]
#[ApiFilter(RangeFilter::class, properties:[
    'createdAt', 'paymentAmount', 'payoutAmount'
])]
class Requisition
{
    public const STATUS_NEW                   = 'NEW';
    public const STATUS_PAYMENT               = 'PAYMENT';
    public const STATUS_INVOICE               = 'INVOICE';
    public const STATUS_PENDING               = 'PENDING';
    public const STATUS_PROCESSED             = 'PROCESSED';
    public const STATUS_FINISHED              = 'FINISHED';
    public const STATUS_CANCELED              = 'CANCELED';
    public const STATUS_DISABLED              = 'DISABLED';
    public const STATUS_ERROR                 = 'ERROR';
    public const STATUS_CARD_VERIFICATION     = 'CARD_VERIFICATION';

    use TimestampableTrait;

    /**
     * @var ?UuidInterface
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     */
    private ?UuidInterface $id;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $paymentAmount;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $payoutAmount;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "requisition:update-mutation"
     * })
     */
    private ?string $status;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $systemProfit;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $course;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $amountWithFee;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $profit;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $pairPercent = 0;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="requisitions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?User $client;

    /**
     * @var Pair|null
     * @ORM\ManyToOne(targetEntity=Pair::class, inversedBy="requisitions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?Pair $pair;

    /**
     * @var PersistentCollection
     * @ORM\ManyToMany(targetEntity=BankDetail::class, inversedBy="requisitions")
     * @Groups({"requisition:item_query"})
     */
    private $bankDetails;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=RequisitionFee::class, mappedBy="requisition", orphanRemoval=true)
     * @Groups({"requisition:item_query"})
     */
    private $requisitionFees;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="requisition")
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private $invoices;

    /**
     * Requisition constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->systemProfit = 0;
        $this->course = 0;
        $this->amountWithFee = 0;
        $this->profit = 0;
        $this->status = self::STATUS_NEW;
        $this->bankDetails = new ArrayCollection();
        $this->requisitionFees = new ArrayCollection();
        $this->invoices = new ArrayCollection();
    }

    /**
     * @return UuidInterface|null
     */
    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getPaymentAmount(): ?float
    {
        return $this->paymentAmount;
    }

    /**
     * @param float $paymentAmount
     * @return $this
     */
    public function setPaymentAmount(float $paymentAmount): self
    {
        $this->paymentAmount = $paymentAmount;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPayoutAmount(): ?float
    {
        return $this->payoutAmount;
    }

    /**
     * @param float $payoutAmount
     * @return $this
     */
    public function setPayoutAmount(float $payoutAmount): self
    {
        $this->payoutAmount = $payoutAmount;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     * @return $this
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getSystemProfit(): ?float
    {
        return $this->systemProfit;
    }

    /**
     * @param float $systemProfit
     * @return $this
     */
    public function setSystemProfit(float $systemProfit): self
    {
        $this->systemProfit = $systemProfit;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getCourse(): ?float
    {
        return $this->course;
    }

    /**
     * @param float $course
     * @return $this
     */
    public function setCourse(float $course): self
    {
        $this->course = $course;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getAmountWithFee(): ?float
    {
        return $this->amountWithFee;
    }

    /**
     * @param float $amountWithFee
     * @return $this
     */
    public function setAmountWithFee(float $amountWithFee): self
    {
        $this->amountWithFee = $amountWithFee;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getProfit(): ?float
    {
        return $this->profit;
    }

    /**
     * @param float $profit
     * @return $this
     */
    public function setProfit(float $profit): self
    {
        $this->profit = $profit;

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
     * @return User|null
     */
    public function getClient(): ?User
    {
        return $this->client;
    }

    /**
     * @param User|null $client
     * @return $this
     */
    public function setClient(?User $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Pair|null
     */
    public function getPair(): ?Pair
    {
        return $this->pair;
    }

    /**
     * @param Pair|null $pair
     * @return $this
     */
    public function setPair(?Pair $pair): self
    {
        $this->pair = $pair;

        return $this;
    }

    /**
     * @return Collection|BankDetail[]
     */
    public function getBankDetails(): Collection
    {
        return $this->bankDetails;
    }

    /**
     * @param BankDetail $bankDetail
     * @return $this
     */
    public function addBankDetail(BankDetail $bankDetail): self
    {
        if (!$this->bankDetails->contains($bankDetail)) {
            $this->bankDetails[] = $bankDetail;
        }

        return $this;
    }

    /**
     * @param BankDetail $bankDetail
     * @return $this
     */
    public function removeBankDetail(BankDetail $bankDetail): self
    {
        $this->bankDetails->removeElement($bankDetail);

        return $this;
    }

    /**
     * @return Collection|RequisitionFee[]
     */
    public function getRequisitionFees(): Collection
    {
        return $this->requisitionFees;
    }

    public function addRequisitionFee(RequisitionFee $requisitionFee): self
    {
        if (!$this->requisitionFees->contains($requisitionFee)) {
            $this->requisitionFees[] = $requisitionFee;
            $requisitionFee->setRequisition($this);
        }

        return $this;
    }

    public function removeRequisitionFee(RequisitionFee $requisitionFee): self
    {
        if ($this->requisitionFees->removeElement($requisitionFee)) {
            // set the owning side to null (unless already changed)
            if ($requisitionFee->getRequisition() === $this) {
                $requisitionFee->setRequisition(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setRequisition($this);
        }

        return $this;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getRequisition() === $this) {
                $invoice->setRequisition(null);
            }
        }

        return $this;
    }
}
