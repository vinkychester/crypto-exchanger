<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CurrencyRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;

/**
 * @ORM\Entity(repositoryClass=CurrencyRepository::class)
 * @ORM\Table(uniqueConstraints={
 *      @UniqueConstraint(name="asset_unique", columns={"asset", "service_id"})
 * })
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['currency:item_query']],
        ],
        'collection_query' => ['normalization_context' => ['groups' => ['currency:collection_query']]],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ],
    ],
    attributes: [
        'order'                     => ['asset' => 'DESC'],
        'pagination_client_enabled' => true,
        'pagination_type'           => 'page'
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'tag' => 'exact',
])]
class Currency
{
    /** @var string */
    public const TYPE_CURRENCY = "CURRENCY";

    /** @var string */
    public const TYPE_CRYPTO = "CRYPTO";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     *     "pair-unit:collection_query",
     *     "currency:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?string $asset;

    /**
     * @var ?float|
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     * })
     */
    private ?float $rate = 1;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=8)
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $tag;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     * })
     */
    private ?float $paymentRate = 1;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     * })
     */
    private ?float $payoutRate = 1;

    /**
     * @var Service|null
     * @ORM\ManyToOne(targetEntity=Service::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "currency:item_query",
     *     "currency:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query"
     * })
     */
    private ?Service $service;

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
    public function getAsset(): ?string
    {
        return $this->asset;
    }

    /**
     * @param string $asset
     * @return $this
     */
    public function setAsset(string $asset): self
    {
        $this->asset = $asset;

        return $this;
    }

    /**
     * @return string|null
     */

    /**
     * @return float|null
     */
    public function getRate(): ?float
    {
        return $this->rate;
    }

    /**
     * @param float $rate
     * @return $this
     */
    public function setRate(float $rate): self
    {
        $this->rate = $rate;

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
     * @return float|null
     */
    public function getPaymentRate(): ?float
    {
        return $this->paymentRate;
    }

    /**
     * @param float $paymentRate
     * @return $this
     */
    public function setPaymentRate(float $paymentRate): self
    {
        $this->paymentRate = $paymentRate;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPayoutRate(): ?float
    {
        return $this->payoutRate;
    }

    /**
     * @param float $payoutRate
     * @return $this
     */
    public function setPayoutRate(float $payoutRate): self
    {
        $this->payoutRate = $payoutRate;

        return $this;
    }

    /**
     * @return Service|null
     */
    public function getService(): ?Service
    {
        return $this->service;
    }

    /**
     * @param Service $service
     * @return $this
     */
    public function setService(?Service $service): self
    {
        $this->service = $service;

        return $this;
    }
}
