<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\PaymentSystemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

// * @ORM\Table(indexes={
// *     @Index(name="payment_system_name_indexe", columns={"name"}),
// *     @Index(name="payment_system_subname_indexe", columns={"sub_name"})
// * })
/**
 * @ORM\Entity(repositoryClass=PaymentSystemRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'collection_query' => ['normalization_context' => ['groups' => ['payment-system:collection_query']]],
        'update'           => ['denormalization_context' => ['groups' => ['payment-system:update-mutation']]],
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
class PaymentSystem
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20, unique=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "payment-system:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?string $name;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair-unit:collection_query",
     * })
     */
    private ?float $price;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20, unique=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "payment-system:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $subName;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "payment-system:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?string $tag;

    /**
     * PaymentSystem constructor.
     */
    public function __construct()
    {
        $this->price = 0;
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
     * @return float|null
     */
    public function getPrice(): ?float
    {
        return $this->price;
    }

    /**
     * @param float $price
     * @return $this
     */
    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getSubName(): ?string
    {
        return $this->subName;
    }

    /**
     * @param string $subName
     * @return $this
     */
    public function setSubName(string $subName): self
    {
        $this->subName = $subName;

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
}
