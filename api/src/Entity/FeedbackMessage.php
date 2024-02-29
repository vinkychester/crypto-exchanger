<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\FeedbackMessageRepository;
use App\Resolver\Mutation\FeedbackMessageMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=FeedbackMessageRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\FeedbackMessageEntityListener"})
 * @ORM\HasLifecycleCallbacks
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['feedback:item_query']],
            'security'              => "is_granted('ROLE_ADMIN')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['feedback:collection_query']],
            'security'              => "is_granted('ROLE_ADMIN')"
        ],
        'create' => [
            'mutation' => FeedbackMessageMutationResolver::class,
            'args' => [
                'email'     => ['type' => 'String'],
                'firstname' => ['type' => 'String'],
                'lastname'  => ['type' => 'String'],
                'message'   => ['type' => 'String'],
            ],
            'denormalization_context' => ['groups' => ['feedback:create_mutation']],
            'security'                => "is_granted('ROLE_CLIENT') or is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['feedback:update_mutation']],
            'security'                => "is_granted('ROLE_ADMIN')"
        ],
        'delete' => ['security' => "is_granted('ROLE_ADMIN')"]
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
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'firstname' => 'partial',
    'lastname' => 'partial',
    'email' => 'partial',
    'status' => 'exact',
])]
#[ApiFilter(BooleanFilter::class, properties: ['deleted'])]
#[ApiFilter(OrderFilter::class, properties: ['status' => 'ASC', 'createdAt' => 'ASC'])]
class FeedbackMessage
{
    public const NOT_VIEWED = 'not_viewed';
    public const VIEWED     = 'viewed';
    public const WELL_DONE  = 'well_done';
    public const DELETED    = 'deleted';

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
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "The name must be at least {{limit}} characters",
     *      maxMessage = "The name cannot be longer than the {{limit}} character",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[-A-zA-яёЁїЇІієЄґҐ ]{2,20}$/",
     *     match=true,
     *     message="The Name field has invalid characters"
     * )
     * @Groups({"feedback:collection_query", "feedback:create-mutation", "feedback:item_query"})
     */
    private ?string $firstname;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Last name must be at least {{limit}} characters",
     *      maxMessage = "Last name cannot be longer than the {{limit}} character",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[-A-zA-яёЁїЇІієЄґҐ ]{2,20}$/",
     *     match=true,
     *     message="The Last Name field has invalid characters"
     * )
     * @Groups({"feedback:collection_query", "feedback:create-mutation","feedback:item_query"})
     */
    private ?string $lastname;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank(message = "Е-mail should not be empty")
     * @Assert\Email(message = "Е-mail has the wrong format")
     * @Groups({"feedback:collection_query", "feedback:create-mutation","feedback:item_query"})
     */
    private ?string $email;

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
     * @Groups({"feedback:collection_query", "feedback:create_mutation","feedback:item_query"})
     */
    private ?string $message;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=50)
     * @Groups({"feedback:collection_query","feedback:update_mutation","feedback:item_query"})
     */
    private ?string $status;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups({"feedback:collection_query", "feedback:update_mutation"})
     */
    private ?bool $deleted;

    /**
     * @var ?PersistentCollection
     * @ORM\OneToMany(targetEntity=FeedbackDetail::class, mappedBy="feedbackMessage", orphanRemoval=true)
     * @Groups({"feedback:collection_query","feedback:item_query"})
     */
    private $feedbackDetails;

    /**
     * FeedbackMessage constructor.
     */
    public function __construct()
    {
        $this->status = self::NOT_VIEWED;
        $this->deleted = false;
        $this->feedbackDetails = new ArrayCollection();
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
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    /**
     * @param string $firstname
     * @return $this
     */
    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    /**
     * @param string $lastname
     * @return $this
     */
    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return $this
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
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
     * @return bool|null
     */
    public function getDeleted(): ?bool
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     * @return $this
     */
    public function setDeleted(bool $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getFeedbackDetails(): Collection
    {
        return $this->feedbackDetails;
    }

    /**
     * @param FeedbackDetail $feedbackDetail
     * @return $this
     */
    public function addFeedbackDetail(FeedbackDetail $feedbackDetail): self
    {
        if (!$this->feedbackDetails->contains($feedbackDetail)) {
            $this->feedbackDetails[] = $feedbackDetail;
            $feedbackDetail->setFeedbackMessage($this);
        }

        return $this;
    }

    /**
     * @param FeedbackDetail $feedbackDetail
     * @return $this
     */
    public function removeFeedbackDetail(FeedbackDetail $feedbackDetail): self
    {
        if ($this->feedbackDetails->removeElement($feedbackDetail)) {
            // set the owning side to null (unless already changed)
            if ($feedbackDetail->getFeedbackMessage() === $this) {
                $feedbackDetail->setFeedbackMessage(null);
            }
        }

        return $this;
    }
}
