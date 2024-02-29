<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\UserRepository;
use App\Resolver\Mutation\ConfirmationMutationResolver;
use App\Resolver\Mutation\ForgotPasswordMutationResolver;
use App\Resolver\Mutation\ChangePasswordMutationResolver;
use App\Resolver\Mutation\AccountChangePasswordMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;

/**
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\UserEntityListener"})
 * @UniqueEntity(fields={"email"}, message="Such email is already used"))
 * @method string getUserIdentifier()
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['user:item_query']],
            'security'              => "(is_granted('ROLE_CLIENT') and object === user) or is_granted('ROLE_ADMIN')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['user:collection_query']],
            'security'              => "is_granted('ROLE_ADMIN')"
        ],
        'create' => [
            'denormalization_context' => ['groups' => ['user:mutation']],
            'security'                => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
        ],
        'update' => [
            'denormalization_context' => ['groups' => ['user:update-mutation']],
            'security'                => "is_granted('ROLE_ADMIN') or is_granted('ROLE_CLIENT')"
        ],
        'delete',
        'confirmationMutation' => [
            'mutation' => ConfirmationMutationResolver::class,
            'args'     => ['token' => ['type' => 'String!']],
            'security' => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
        ],
        'forgotPasswordMutation' => [
            'mutation'          => ForgotPasswordMutationResolver::class,
            'args'              => ['email' => ['type' => 'String!']],
            'validation_groups' => ['user:forgot-password'],
            'security'          => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
        ],
        'changePasswordMutation' => [
            'mutation' => ChangePasswordMutationResolver::class,
            'args' => [
                'token'              => ['type' => 'String!'],
                'newPassword'        => ['type' => 'String!'],
                'newRetypedPassword' => ['type' => 'String!'],
            ],
            'normalization_context'   => ['groups' => ['user:change-password']],
            'denormalization_context' => ['groups' => ['user:change-password']],
            'validation_groups'       => ['user:change-password'],
            'validate'                => false,
            'security'                => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
        ],
        'accountChangePasswordMutation' => [
            'mutation' => AccountChangePasswordMutationResolver::class,
            'args'     => [
                'id'                 => ['type' => 'ID!'],
                'oldPassword'        => ['type' => 'String!'],
                'newPassword'        => ['type' => 'String!'],
                'newRetypedPassword' => ['type' => 'String!'],
            ],
            'normalization_context'   => ['groups' => ['user:change-password']],
            'denormalization_context' => ['groups' => ['user:change-password']],
            'validation_groups'       => ['user:change-password'],
            'validate'                => false,
            'security'                => "is_granted('ROLE_CLIENT') and object === user",
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
        'pagination_type' => 'page',
        'order'           => ['createdAt' => 'DESC']
    ]
)]
#[ApiFilter(DateFilter::class, properties: ['createdAt'])]
#[ApiFilter(SearchFilter::class, properties: [
    'firstname' => 'partial',
    'lastname'  => 'partial',
    'email'     => 'partial',
    'roles'     => 'exact'
])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const ROLE_CLIENT = "ROLE_CLIENT";
    public const ROLE_SEO    = "ROLE_SEO";
    public const ROLE_ADMIN  = "ROLE_ADMIN";

    public const REGISTRATION_DEFAULT  = 'default';
    public const REGISTRATION_TRAFFIC  = 'traffic';
    public const REGISTRATION_REFERRAL = 'referral';

    public const STATUS_STABLE     = "stable";
    public const STATUS_TRUSTED    = "trusted";
    public const STATUS_SUSPICIOUS = "suspicious";

    use TimestampableTrait;

    /**
     * @var ?UuidInterface
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     */
    private ?UuidInterface $id;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:update-mutation",
     *     "user:mutation",
     *     "review:collection_query",
     *     "review:item_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "credit:collection_query",
     *     "credit:item_query"
     * })
     */
    private ?string $firstname;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:mutation",
     *     "user:update-mutation",
     *     "review:collection_query",
     *     "review:item_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "credit:collection_query",
     *     "credit:item_query"
     * })
     */
    private ?string $lastname;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=100)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:mutation",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "credit:collection_query",
     *     "credit:item_query"
     * })
     */
    private ?string $email;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=120)
     */
    private ?string $password;

    /**
     * @var string|null
     * @Groups({"change-password", "anonim:change-password", "user:change-password"})
     * @Assert\NotBlank(groups={"change-password", "user:change-password"})
     * @Assert\Regex(
     *     pattern="/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/",
     *     message="Password must be at least eight characters and contain at least one number, one uppercase letter and one lowercase letter",
     *     groups={"change-password", "anonim:change-password", "user:change-password"}
     * )
     * @Assert\Expression(
     *     "this.getOldPassword() != this.getNewRetypedPassword()",
     *     message="The new password must not be the same as the old password.",
     *     groups={"change-password", "user:change-password"}
     * )
     */
    private ?string $newPassword = "";

    /**
     * @var string|null
     * @Groups({"change-password", "anonim:change-password", "user:change-password"})
     * @Assert\NotBlank(groups={"change-password", "user:change-password"})
     * @Assert\Expression(
     *     "this.getNewPassword() === this.getNewRetypedPassword()",
     *     message="Passwords do not match with each other!",
     *     groups={"change-password", "anonim:change-password", "user:change-password"}
     * )
     */
    private ?string $newRetypedPassword = "";

    /**
     * @var string|null
     * @Groups({"user:change-password"})
     * @Assert\NotBlank(groups={"user:change-password"})
     * @SecurityAssert\UserPassword(
     *     message="This value must be the current user password",
     *     groups={"user:change-password"}
     * )
     */
    private ?string $oldPassword = "";

    /**
     * @var ?string
     * @ORM\Column(type="string", length=30)
     */
    private ?string $token;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups("user:update-mutation")
     * })
     */
    private ?bool $isEnabled;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:update-mutation",
     * })
     */
    private ?bool $isBanned;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"user:collection_query", "user:item_query", "admins:update_user"})
     */
    private ?string $googleAuthenticatorSecret = '';

    /**
     * @var ?string
     * @ORM\Column(type="string", length=150, nullable=true)
     * @Groups({"user:collection_query", "user:item_query", "admins:update_user"})
     */
    private ?string $googleAuthQrCode = '';

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     */
    private ?bool $isOnline;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=20)
     */
    private ?string $status;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=40)
     */
    private ?string $referralToken;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?string $registrationType;

    /**
     * @var ?string
     */
    private ?string $generatedPassword;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     */
    private ?bool $isGoogleAuthenticatorEnabled;

    /**
     * @var string
     * @ORM\Column(type="string")
     * @Groups({
     *     "user:mutation"
     * })
     */
    private string $roles;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=BankDetail::class, mappedBy="client", orphanRemoval=true)
     */
    private $bankDetails;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Requisition::class, mappedBy="client")
     */
    private $requisitions;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=CreditCard::class, mappedBy="client")
     */
    private $creditCards;

    /**
     * @var MediaObject|null
     * @ORM\OneToOne(targetEntity=MediaObject::class, mappedBy="user", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private ?MediaObject $mediaObject;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:update-mutation",
     * })
     */
    private ?bool $isDeleted;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->isEnabled = false;
        $this->isBanned = false;
        $this->isOnline = false;
        $this->isGoogleAuthenticatorEnabled = false;
        $this->status = self::STATUS_STABLE;
        $this->registrationType = self::REGISTRATION_DEFAULT;
        $this->token = bin2hex(random_bytes(15));
        $this->referralToken = bin2hex(random_bytes(12));
        $this->bankDetails = new ArrayCollection();
        $this->requisitions = new ArrayCollection();
        $this->creditCards = new ArrayCollection();
        $this->isDeleted = false;
    }

    /**
     * @return UuidInterface|null
     */
    public function getId(): ?UuidInterface
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
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * @param string $password
     * @return $this
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getNewPassword(): ?string
    {
        return $this->newPassword;
    }

    /**
     * @param string $newPassword
     * @return $this
     */
    public function setNewPassword(string $newPassword): self
    {
        $this->newPassword = $newPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getNewRetypedPassword(): ?string
    {
        return $this->newRetypedPassword;
    }

    /**
     * @param string $newRetypedPassword
     * @return $this
     */
    public function setNewRetypedPassword(string $newRetypedPassword): self
    {
        $this->newRetypedPassword = $newRetypedPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getOldPassword(): ?string
    {
        return $this->oldPassword;
    }

    /**
     * @param string $oldPassword
     * @return $this
     */
    public function setOldPassword(string $oldPassword): self
    {
        $this->oldPassword = $oldPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getToken(): ?string
    {
        return $this->token;
    }

    /**
     * @param string $token
     * @return $this
     */
    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsEnabled(): ?bool
    {
        return $this->isEnabled;
    }

    /**
     * @param bool $isEnabled
     * @return $this
     */
    public function setIsEnabled(bool $isEnabled): self
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsBanned(): ?bool
    {
        return $this->isBanned;
    }

    /**
     * @param bool $isBanned
     * @return $this
     */
    public function setIsBanned(bool $isBanned): self
    {
        $this->isBanned = $isBanned;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getGoogleAuthenticatorSecret(): ?string
    {
        return $this->googleAuthenticatorSecret;
    }

    /**
     * @param string|null $googleAuthenticatorSecret
     * @return $this
     */
    public function setGoogleAuthenticatorSecret(?string $googleAuthenticatorSecret): self
    {
        $this->googleAuthenticatorSecret = $googleAuthenticatorSecret;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getGoogleAuthQrCode(): ?string
    {
        return $this->googleAuthQrCode;
    }

    /**
     * @param string|null $googleAuthQrCode
     * @return $this
     */
    public function setGoogleAuthQrCode(?string $googleAuthQrCode): self
    {
        $this->googleAuthQrCode = $googleAuthQrCode;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsOnline(): ?bool
    {
        return $this->isOnline;
    }

    /**
     * @param bool $isOnline
     * @return $this
     */
    public function setIsOnline(bool $isOnline): self
    {
        $this->isOnline = $isOnline;

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
    public function getReferralToken(): ?string
    {
        return $this->referralToken;
    }

    /**
     * @param string $referralToken
     * @return $this
     */
    public function setReferralToken(string $referralToken): self
    {
        $this->referralToken = $referralToken;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getRegistrationType(): ?string
    {
        return $this->registrationType;
    }

    /**
     * @param string $registrationType
     * @return $this
     */
    public function setRegistrationType(string $registrationType): self
    {
        $this->registrationType = $registrationType;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getGeneratedPassword(): ?string
    {
        return $this->generatedPassword;
    }

    /**
     * @param string $generatedPassword
     * @return $this
     */
    public function setGeneratedPassword(string $generatedPassword): self
    {
        $this->generatedPassword = $generatedPassword;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsGoogleAuthenticatorEnabled(): ?bool
    {
        return $this->isGoogleAuthenticatorEnabled;
    }

    /**
     * @param bool $isGoogleAuthenticatorEnabled
     * @return $this
     */
    public function setIsGoogleAuthenticatorEnabled(bool $isGoogleAuthenticatorEnabled): self
    {
        $this->isGoogleAuthenticatorEnabled = $isGoogleAuthenticatorEnabled;

        return $this;
    }

    /**
     * @param string $roles
     * @return $this
     */
    public function setRoles(string $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): array
    {
        $roles[] = $this->roles;

        return array_unique($roles);
    }

    public function getSalt()
    {
        // TODO: Implement getSalt() method.
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getUsername(): ?string
    {
        return $this->email;
    }

    public function __call(string $name, array $arguments)
    {
        // TODO: Implement @method string getUserIdentifier()
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
            $bankDetail->setClient($this);
        }

        return $this;
    }

    /**
     * @param BankDetail $bankDetail
     * @return $this
     */
    public function removeBankDetail(BankDetail $bankDetail): self
    {
        if ($this->bankDetails->removeElement($bankDetail)) {
            // set the owning side to null (unless already changed)
            if ($bankDetail->getClient() === $this) {
                $bankDetail->setClient(null);
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
            $requisition->setClient($this);
        }

        return $this;
    }

    public function removeRequisition(Requisition $requisition): self
    {
        if ($this->requisitions->removeElement($requisition)) {
            // set the owning side to null (unless already changed)
            if ($requisition->getClient() === $this) {
                $requisition->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|CreditCard[]
     */
    public function getCreditCards(): Collection
    {
        return $this->creditCards;
    }

    /**
     * @param CreditCard $creditCard
     * @return $this
     */
    public function addCreditCard(CreditCard $creditCard): self
    {
        if (!$this->creditCards->contains($creditCard)) {
            $this->creditCards[] = $creditCard;
            $creditCard->setClient($this);
        }

        return $this;
    }

    /**
     * @param CreditCard $creditCard
     * @return $this
     */
    public function removeCreditCard(CreditCard $creditCard): self
    {
        if ($this->creditCards->removeElement($creditCard)) {
            // set the owning side to null (unless already changed)
            if ($creditCard->getClient() === $this) {
                $creditCard->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return MediaObject|null
     */
    public function getMediaObject(): ?MediaObject
    {
        return $this->mediaObject;
    }

    /**
     * @param MediaObject|null $mediaObject
     * @return $this
     */
    public function setMediaObject(?MediaObject $mediaObject): self
    {
        // unset the owning side of the relation if necessary
        if ($mediaObject === null && $this->mediaObject !== null) {
            $this->mediaObject->setUser(null);
        }

        // set the owning side of the relation if necessary
        if ($mediaObject !== null && $mediaObject->getUser() !== $this) {
            $mediaObject->setUser($this);
        }

        $this->mediaObject = $mediaObject;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsDeleted(): ?bool
    {
        return $this->isDeleted;
    }

    /**
     * @param bool $isDeleted
     * @return $this
     */
    public function setIsDeleted(bool $isDeleted): self
    {
        $this->isDeleted = $isDeleted;

        return $this;
    }
}
