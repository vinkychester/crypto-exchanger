<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\MediaObjectRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=MediaObjectRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
        graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['media-object:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['media-object:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => \ApiPlatform\Core\Action\NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ]
    ],
    attributes: ['pagination_enabled' => false]
)]
class MediaObject
{
    public const AVATAR_TYPE   = "avatar";
    public const POST_TYPE     = "post";
    public const CREDIT_TYPE   = "credit";
    public const PREVIEW_TYPE  = "preview";
    public const DETAIL_TYPE   = "detail";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=80)
     */
    private ?string $contentUrl;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10)
     */
    private ?string $storage;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10)
     */
    private ?string $type;

    /**
     * @var string|null
     * @Groups({
     *     "media-object:collection_query",
     *     "media-object:item_query",
     *     "credit:collection_query",
     *     "credit:item_query"
     * })
     */
    private ?string $base64 = "";

    /**
     * @var File
     */
    private File $file;

    /**
     * @var User|null
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="mediaObject", cascade={"persist", "remove"})
     */
    private ?User $user;

    /**
     * @var CreditCard|null
     * @ORM\ManyToOne(targetEntity=CreditCard::class, inversedBy="mediaObjects", cascade={"persist", "remove"})
     */
    private ?CreditCard $creditCard;

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
    public function getContentUrl(): ?string
    {
        return $this->contentUrl;
    }

    /**
     * @param string $contentUrl
     * @return $this
     */
    public function setContentUrl(string $contentUrl): self
    {
        $this->contentUrl = $contentUrl;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStorage(): ?string
    {
        return $this->storage;
    }

    /**
     * @param string $storage
     * @return $this
     */
    public function setStorage(string $storage): self
    {
        $this->storage = $storage;

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
     * @return string|null
     */
    public function getBase64(): ?string
    {
        return $this->base64;
    }

    /**
     * @param string $base64
     * @return $this
     */
    public function setBase64(string $base64): self
    {
        $this->base64 = $base64;

        return $this;
    }

    /**
     * @return File|null
     */
    public function getFile(): ?File
    {
        return $this->file;
    }

    /**
     * @param File $file
     * @return $this
     */
    public function setFile(File $file): self
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return $this
     */
    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return CreditCard|null
     */
    public function getCreditCard(): ?CreditCard
    {
        return $this->creditCard;
    }

    /**
     * @param CreditCard|null $creditCard
     * @return $this
     */
    public function setCreditCard(?CreditCard $creditCard): self
    {
        $this->creditCard = $creditCard;

        return $this;
    }
}
