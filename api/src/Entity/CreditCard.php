<?php

namespace App\Entity;


use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\CreditCardRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use JetBrains\PhpStorm\Pure;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Validator as AcmeAssert;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CreditCardRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\CreditCardEntityListener"})
 * @ORM\HasLifecycleCallbacks()
 * @UniqueEntity(
 *     fields={"cardNumber"},
 *     repositoryMethod="uniqueCreditCard",
 *     message="Данная карта ожидает верификации либо уже подтверждена",
 *     groups={"credit:create"}
 * )
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['credit:item_query']],
            'security' => "(is_granted('ROLE_CLIENT') and object.getClient().getId() == user.getId()) or is_granted('ROLE_ADMIN')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['credit:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')",
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['credit:update-mutation']],
            'validation_groups' => ['credit:update'],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')",
        ],
        'delete' => [
            'security' => "is_granted('ROLE_CLIENT')",
        ],
        'create' => [
            'mutation' => \App\Resolver\Mutation\CreditCardMutationResolver::class,
            'denormalization_context' => ['groups' => ['credit:mutation_create']],
            'validation_groups'       => ['credit:create'],
            'security' => "is_granted('ROLE_CLIENT')",
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => \ApiPlatform\Core\Action\NotFoundAction::class,
            'read' => false,
            'output' => false
        ]
    ],
    attributes: [
        'order' => ['createdAt' => 'DESC'],
        'pagination_type' => 'page',
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'id' => 'partial',
    'client.firstname' => 'partial',
    'client.lastname' => 'partial',
    'client.email' => 'partial',
    'cardNumber' => 'partial',
    'cardMask' => 'partial',
    'client.id' => 'exact',
    'status' => 'exact'
])]
#[ApiFilter(RangeFilter::class, properties:['createdAt'])]
class CreditCard
{
    public const VERIFIED      = "VERIFIED";
    public const NOT_VERIFIED  = "NOT_VERIFIED";
    public const CANCELED      = "CANCELED";
    public const PAST_DUE_DATE = "PAST_DUE_DATE";

    use TimestampableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=16)
     * @Groups({"credit:mutation_create", "credit:collection_query", "credit:item_query"})
     * @Assert\NotBlank(
     *     message="Поле с банковской картой должно быть заполнено",
     *     groups={"credit:create"}
     * )
     * @AcmeAssert\UniqueCardUser(groups={"credit:create"})
     * @AcmeAssert\CardScheme(groups={"credit:create"})
     */
    private ?string $cardNumber;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10)
     * @Groups({"credit:mutation_create", "credit:collection_query", "credit:item_query"})
     * @AcmeAssert\ExpirationDate(groups={"credit:create"})
     */
    private ?string $expiryDate;

    // @Assert\NotBlank(message="Поле с примечанием должно быть заполненным", groups={"credit:update"})
    /**
     * @var string|null
     * @ORM\Column(type="string", length=6000, nullable=true)
     * @Groups({"credit:collection_query", "credit:item_query", "credit:update-mutation"})
     *
     * @Assert\Length(
     *      min = 10,
     *      max = 1200,
     *      minMessage = "Примечание должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Примечание не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false,
     *      groups={"credit:update"}
     * )
     * @Assert\Regex(
     *     pattern="/^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:\-()]*$/muD",
     *     htmlPattern="^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:\-()]*$",
     *     match=true,
     *     message="Примечание не должно содержать спецификаторы",
     *     groups={"credit:update"}
     * )
     */
    private ?string $comment;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=14)
     * @Groups({"credit:collection_query", "credit:item_query", "credit:update-mutation"})
     */
    private ?string $status;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=16)
     * @Groups({"credit:mutation_create", "credit:collection_query", "credit:item_query"})
     */
    private ?string $cardMask;

    /**
     * @var array
     * @Groups({"credit:mutation_create"})
     */
    private array $files = [];

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="creditCards")
     * @Groups({"credit:mutation_create", "credit:collection_query", "credit:item_query"})
     */
    private ?User $client;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=MediaObject::class, mappedBy="creditCard", orphanRemoval=true, cascade={"persist", "remove"})
     * @Groups({"credit:item_query"})
     */
    private $mediaObjects;

    /**
     * CreditCard constructor.
     */
    #[Pure] public function __construct()
    {
        $this->status = self::NOT_VERIFIED;
        $this->mediaObjects = new ArrayCollection();
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
    public function getCardNumber(): ?string
    {
        return $this->cardNumber;
    }

    /**
     * @param string $cardNumber
     * @return $this
     */
    public function setCardNumber(string $cardNumber): self
    {
        $this->cardNumber = $cardNumber;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getExpiryDate(): ?string
    {
        return $this->expiryDate;
    }

    /**
     * @param string $expiryDate
     * @return $this
     */
    public function setExpiryDate(string $expiryDate): self
    {
        $this->expiryDate = $expiryDate;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     * @return $this
     */
    public function setComment(string $comment): self
    {
        $this->comment = $comment;

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
     * @return string|null
     */
    public function getCardMask(): ?string
    {
        return $this->cardMask;
    }

    /**
     * @param string $cardMask
     * @return $this
     */
    public function setCardMask(string $cardMask): self
    {
        $this->cardMask = $cardMask;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getFiles(): ?array
    {
        return $this->files;
    }

    /**
     * @param array $files
     * @return $this
     */
    public function setFiles(array $files): self
    {
        $this->files = $files;

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
     * @return Collection|MediaObject[]
     */
    public function getMediaObjects(): Collection
    {
        return $this->mediaObjects;
    }

    /**
     * @param MediaObject $mediaObject
     * @return $this
     */
    public function addMediaObject(MediaObject $mediaObject): self
    {
        if (!$this->mediaObjects->contains($mediaObject)) {
            $this->mediaObjects[] = $mediaObject;
            $mediaObject->setCreditCard($this);
        }

        return $this;
    }

    /**
     * @param MediaObject $mediaObject
     * @return $this
     */
    public function removeMediaObject(MediaObject $mediaObject): self
    {
        if ($this->mediaObjects->removeElement($mediaObject)) {
            // set the owning side to null (unless already changed)
            if ($mediaObject->getCreditCard() === $this) {
                $mediaObject->setCreditCard(null);
            }
        }

        return $this;
    }
}
