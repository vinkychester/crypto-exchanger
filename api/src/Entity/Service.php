<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ServiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ServiceRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'collection_query' => ['normalization_context' => ['groups' => ['service:collection_query']]],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ],
    ],
    attributes: ['pagination_enabled' => false]
)]
class Service
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "currency:collection_query",
     *     "service:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query"
     * })
     */
    private ?string $name;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20, unique=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "currency:collection_query",
     *     "service:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query"
     * })
     */
    private ?string $tag;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "currency:collection_query",
     *     "service:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query"
     * })
     */
    private ?string $title;

    /**
     * @var UuidInterface|null
     * @ORM\Column(type="uuid", unique=true)
     */
    private ?UuidInterface $connection;

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
    public function getTag(): ?string
    {
        return $this->tag;
    }

    /**
     * @param string $tag
     * @return $this
     */
    public function setTag(string $tag): self
    {
        $this->tag = $tag;

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
     * @return UuidInterface
     */
    public function getConnection(): UuidInterface
    {
        return $this->connection;
    }

    /**
     * @param UuidInterface|null $connection
     * @return $this
     */
    public function setConnection( ?UuidInterface $connection): self
    {
        $this->connection = $connection;

        return $this;
    }
}
