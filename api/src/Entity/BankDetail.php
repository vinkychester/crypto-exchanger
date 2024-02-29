<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\BankDetailRepository;
use App\Resolver\Mutation\CreateBankDetailMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=BankDetailRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['bank-details:item_query']],
            'security'              => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['bank-details:collection_query']],
            'security'              => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'create' => [
            'mutation' => CreateBankDetailMutationResolver::class,
            'denormalization_context' => ['groups' => ['bank-detail:mutation_create']],
            'security'                => "is_granted('ROLE_CLIENT')",
            'args' => [
                'attributes' => ['type' => 'Iterable!'],
                'pairUnit'   => ['type' => 'String!'],
                'client'     => ['type' => 'String!'],
                'direction'  => ['type' => 'String!'],
                'title'      => ['type' => 'String!'],
            ],
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['bank-detail:mutation_update']],
            'security'                => "is_granted('ROLE_CLIENT')"
        ],
        'delete' => ['security' => "is_granted('ROLE_CLIENT')"]
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
#[ApiFilter(NumericFilter::class, properties: ['pairUnit.id'])]
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',
    'attributes.value' => 'partial',
    'client.id' => 'exact',
    'direction' => 'exact',
    'pairUnit.paymentSystem.name' => 'exact',
    'pairUnit.currency.asset' => 'exact',
])]
class BankDetail
{
    use TimestampableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=8)
     * @Groups({
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     *     "requisition:item_query",
     *     "bank-detail:mutation_create"
     * })
     */
    private ?string $direction;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=30)
     * @Groups({
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     *     "bank-detail:mutation_update",
     *     "bank-detail:mutation_create"
     * })
     */
    private ?string $title;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="bankDetails", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     *     "bank-detail:mutation_create"
     * })
     */
    private ?User $client;

    /**
     * @var PairUnit|null
     * @ORM\ManyToOne(targetEntity=PairUnit::class, inversedBy="bankDetails", cascade={"persist", "remove"})
     * @Groups({
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     *     "bank-detail:mutation_create"
     * })
     */
    private ?PairUnit $pairUnit;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Attribute::class, mappedBy="bankDetail", orphanRemoval=true, cascade={"persist", "remove"})
     * @Groups({
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     *     "requisition:item_query"
     * })
     */
    private $attributes;

    /**
     * @ORM\ManyToMany(targetEntity=Requisition::class, mappedBy="bankDetails", cascade={"persist"})
     */
    private $requisitions;

    /**
     * BankDetail constructor.
     */
    #[Pure] public function __construct()
    {
        $this->attributes = new ArrayCollection();
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
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return $this
     */
    public function setTitle(string $title): self
    {
        $this->title = $title;

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
     * @return PairUnit|null
     */
    public function getPairUnit(): ?PairUnit
    {
        return $this->pairUnit;
    }

    /**
     * @param PairUnit|null $pairUnit
     * @return $this
     */
    public function setPairUnit(?PairUnit $pairUnit): self
    {
        $this->pairUnit = $pairUnit;

        return $this;
    }

    /**
     * @return Collection|Attribute[]
     */
    public function getAttributes(): Collection
    {
        return $this->attributes;
    }

    /**
     * @param Attribute $attribute
     * @return $this
     */
    public function addAttribute(Attribute $attribute): self
    {
        if (!$this->attributes->contains($attribute)) {
            $this->attributes[] = $attribute;
            $attribute->setBankDetail($this);
        }

        return $this;
    }

    /**
     * @param Attribute $attribute
     * @return $this
     */
    public function removeAttribute(Attribute $attribute): self
    {
        if ($this->attributes->removeElement($attribute)) {
            // set the owning side to null (unless already changed)
            if ($attribute->getBankDetail() === $this) {
                $attribute->setBankDetail(null);
            }
        }

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
            $requisition->addBankDetail($this);
        }

        return $this;
    }

    public function removeRequisition(Requisition $requisition): self
    {
        if ($this->requisitions->removeElement($requisition)) {
            $requisition->removeBankDetail($this);
        }

        return $this;
    }
}
