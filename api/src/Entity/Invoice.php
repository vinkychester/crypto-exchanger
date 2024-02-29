<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\InvoiceRepository;
use App\Resolver\Mutation\InvoiceMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use JetBrains\PhpStorm\Pure;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['invoice:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['invoice:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'create' => [
            'mutation' => InvoiceMutationResolver::class,
            'denormalization_context' => ['groups' => ['invoice:mutation_create']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ]
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
class Invoice
{
    public const STATUS_NEW                   = 'NEW';
    public const STATUS_PENDING               = 'PENDING';
    public const STATUS_PROCESSED             = 'PROCESSED';
    public const STATUS_STABLING              = 'STABLING';
    public const STATUS_CANCEL                = 'CANCEL';
    public const STATUS_DIRTY                 = 'DIRTY';
    public const STATUS_FAIL                  = 'FAIL';
    public const STATUS_CARD_VERIFICATION     = 'CARD_VERIFICATION';

    public const CALLBACK_TOPIC               = "http://buycoin/callback/";
    public const INVOICE_TOPIC                = "http://buycoin/invoice/";

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
     */
    private ?float $paidAmount;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=8)
     * @Groups({
     *     "invoice:item_query",
     *     "invoice:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $direction;

    /**
     * @var UuidInterface|null
     * @ORM\Column(type="uuid")
     */
    private ?UuidInterface $referenceId;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "invoice:item_query",
     *     "invoice:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $status;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $amount;

    /**
     * @var UuidInterface|null
     * @ORM\Column(type="uuid", nullable=true)
     */
    private ?UuidInterface $externalId;

    /**
     * @var Requisition|null
     * @ORM\ManyToOne(targetEntity=Requisition::class, inversedBy="invoices")
     * @Groups({"invoice:mutation_create"})
     */
    private ?Requisition $requisition;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=FlowData::class, mappedBy="invoice", cascade={"persist"})
     * @Groups({"invoice:item_query", "invoice:collection_query"})
     */
    private $flowData;

    /**
     * Invoice constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->referenceId = Uuid::uuid4();
        $this->paidAmount = 0;
        $this->amount = 0;
        $this->status = self::STATUS_NEW;
        $this->flowData = new ArrayCollection();
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
    public function getPaidAmount(): ?float
    {
        return $this->paidAmount;
    }

    /**
     * @param float $paidAmount
     * @return $this
     */
    public function setPaidAmount(float $paidAmount): self
    {
        $this->paidAmount = $paidAmount;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDirection(): ?string
    {
        return $this->direction;
    }

    /**
     * @param string $direction
     * @return $this
     */
    public function setDirection(string $direction): self
    {
        $this->direction = $direction;

        return $this;
    }

    /**
     * @return UuidInterface|null
     */
    public function getReferenceId(): ?UuidInterface
    {
        return $this->referenceId;
    }

    /**
     * @param UuidInterface|null $referenceId
     * @return $this
     */
    public function setReferenceId(?UuidInterface $referenceId): self
    {
        $this->referenceId = $referenceId;

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
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return $this
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return UuidInterface|null
     */
    public function getExternalId(): ?UuidInterface
    {
        return $this->externalId;
    }

    /**
     * @param UuidInterface|null $externalId
     * @return $this
     */
    public function setExternalId(?UuidInterface $externalId): self
    {
        $this->externalId = $externalId;

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

    /**
     * @return Collection|FlowData[]
     */
    public function getFlowData(): Collection
    {
        return $this->flowData;
    }

    /**
     * @param FlowData $flowData
     * @return $this
     */
    public function addFlowData(FlowData $flowData): self
    {
        if (!$this->flowData->contains($flowData)) {
            $this->flowData[] = $flowData;
            $flowData->setInvoice($this);
        }

        return $this;
    }

    /**
     * @param FlowData $flowData
     * @return $this
     */
    public function removeFlowData(FlowData $flowData): self
    {
        if ($this->flowData->removeElement($flowData)) {
            // set the owning side to null (unless already changed)
            if ($flowData->getInvoice() === $this) {
                $flowData->setInvoice(null);
            }
        }

        return $this;
    }
}
