<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\ReviewRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=ReviewRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\ReviewEntityListener"})
 */
#[ApiResource(
    collectionOperations: [],
        graphql: [
        'item_query'       => ['normalization_context' => ['groups' => ['review:item_query']]],
        'collection_query' => ['normalization_context' => ['groups' => ['review:collection_query']]],
        'create'           => ['denormalization_context' => ['groups' => ['review:create-mutation']]],
        'update'           => ['denormalization_context' => ['groups' => ['review:update-mutation']]],
        'delete'
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ],
    ],
    attributes: [
        'order'                     => ['createdAt' => 'DESC'],
        'pagination_client_enabled' => true,
        'pagination_type'           => 'page'
    ]
)]
#[ApiFilter(BooleanFilter::class, properties: ['publish'])]
#[ApiFilter(RangeFilter::class, properties: ['createdAt'])]
#[ApiFilter(SearchFilter::class, properties: [
    'client.firstname' => 'partial',
    'client.lastname' => 'partial'
])]
class Review
{
    use TimestampableTrait;

    /**
     * @var ?int
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var ?string
     * @ORM\Column(type="text")
     * @Assert\Length(
     *     min="3",
     *     max="1200",
     *     minMessage = "The field must be at least long  {{ limit }} characters",
     *     maxMessage = "The field cannot be longer {{ limit }} characters"
     *     )
     * @Groups({"review:item_query", "review:collection_query", "review:create-mutation", "review:update-mutation"})
     */
    private ?string $message;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups({"review:item_query", "review:collection_query", "review:update-mutation"})
     */
    private ?bool $publish;

    /**
     * @var ?User
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"review:item_query", "review:collection_query", "review:update-mutation", "review:create-mutation"})
     */
    private ?User $client;

    /**
     * Review constructor.
     */
    public function __construct()
    {
        $this->publish = 0;
        $this->createdAt = time();
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
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getPublish(): ?bool
    {
        return $this->publish;
    }

    /**
     * @param bool $publish
     * @return $this
     */
    public function setPublish(bool $publish): self
    {
        $this->publish = $publish;

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
}
