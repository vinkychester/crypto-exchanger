<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\FeedbackDetailRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=FeedbackDetailRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\FeedbackDetailEntityListener"})
 * @ORM\HasLifecycleCallbacks
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['feedbackDetail:item_query']],
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['feedbackDetail:collection_query']],
        ],
        'create' => [
            'denormalization_context' => ['groups' => ['feedbackDetail:create_mutation']],
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['feedbackDetail:update_mutation']],
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ]
],
    attributes: [
        'pagination_enabled' => false,
    ]
)]
class FeedbackDetail
{
    public const CLIENT = 'client';
    public const ADMIN = 'admin';

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
     * @Assert\NotBlank(
     *     message = "Your message should not be blank",
     * )
     * @Assert\Length(
     *     min = 3,
     *     max = 3600,
     *     minMessage = "Your message must be at least {{limit}} characters long",
     *     maxMessage = "Your message cannot be longer than {{limit}} characters",
     * )
     * @Groups({"feedbackDetail:collection_query","feedbackDetail:item_query", "feedbackDetail:create_mutation"})
     */
    private ?string $message;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=10)
     * @Groups({"feedbackDetail:collection_query","feedbackDetail:item_query", "feedbackDetail:create_mutation"})
     */
    private ?string $author;

    /**
     * @var ?FeedbackMessage
     * @ORM\ManyToOne(targetEntity=FeedbackMessage::class, inversedBy="feedbackDetails")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"feedbackDetail:create_mutation"})
     */
    private ?FeedbackMessage $feedbackMessage;

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
     * @return string|null
     */
    public function getAuthor(): ?string
    {
        return $this->author;
    }

    /**
     * @param string $author
     * @return $this
     */
    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return FeedbackMessage|null
     */
    public function getFeedbackMessage(): ?FeedbackMessage
    {
        return $this->feedbackMessage;
    }

    /**
     * @param FeedbackMessage|null $feedbackMessage
     * @return $this
     */
    public function setFeedbackMessage(?FeedbackMessage $feedbackMessage): self
    {
        $this->feedbackMessage = $feedbackMessage;

        return $this;
    }
}
