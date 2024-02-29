<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use App\Repository\AttributeRepository;
use App\Resolver\Query\AttributeCollectionQueryResolver;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AttributeRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['attributes:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['attributes:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
        ],
        'collectionQuery' => [
            'collection_query' => AttributeCollectionQueryResolver::class,
            'args' => [
                'pairUnit_id' => ['type' => 'Int!'],
                'direction' => ['type' => 'String!'],
                'locale' => ['type' => 'String!']
            ]
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['attribute:mutation_update']],
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
#[ApiFilter(BooleanFilter::class, properties: ['isHidden'])]
class Attribute
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @Groups({"attributes:collection_query"})
     */
    private ?string $direction;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "attributes:collection_query",
     *     "attributes:item_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     * })
     */
    private ?string $name;

    /**
     * @var string|null
     * @Groups({"attributes:collection_query"})
     */
    private ?string $title;

    /**
     * @var string|null
     * @Groups({"attributes:collection_query"})
     */
    private ?string $fieldType;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=80)
     * @Groups({
     *     "attributes:collection_query",
     *     "attributes:item_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query",
     *     "bank-details:item_query",
     * })
     */
    private ?string $value;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean")
     * @Groups({"attributes:collection_query"})
     */
    private ?bool $isHidden;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=80, nullable=true)
     * @Groups({"attributes:collection_query"})
     */
    private ?string $information;

    /**
     * @ORM\ManyToOne(targetEntity=BankDetail::class, inversedBy="attributes", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $bankDetail;

    /**
     * Attribute constructor.
     */
    public function __construct()
    {
        $this->isHidden = false;
    }

    /**
     * @param int|null $id
     * @return $this
     */
    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
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
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName(string $name): self
    {
        $this->name = $name;

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
     * @return string|null
     */
    public function getFieldType(): ?string
    {
        return $this->fieldType;
    }

    /**
     * @param string $fieldType
     * @return $this
     */
    public function setFieldType(string $fieldType): self
    {
        $this->fieldType = $fieldType;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @param string $value
     * @return $this
     */
    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsHidden(): ?bool
    {
        return $this->isHidden;
    }

    /**
     * @param bool $isHidden
     * @return $this
     */
    public function setIsHidden(bool $isHidden): self
    {
        $this->isHidden = $isHidden;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getInformation(): ?string
    {
        return $this->information;
    }

    /**
     * @param string $information
     * @return $this
     */
    public function setInformation(string $information): self
    {
        $this->information = $information;

        return $this;
    }

    /**
     * @return BankDetail|null
     */
    public function getBankDetail(): ?BankDetail
    {
        return $this->bankDetail;
    }

    /**
     * @param BankDetail|null $bankDetail
     * @return $this
     */
    public function setBankDetail(?BankDetail $bankDetail): self
    {
        $this->bankDetail = $bankDetail;

        return $this;
    }
}
