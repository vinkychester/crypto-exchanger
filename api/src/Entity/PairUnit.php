<?php


namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\PairUnitRepository;
use App\Resolver\Query\CryptoCollectionPairUnitResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use JetBrains\PhpStorm\Pure;

/**
 * @ORM\Entity(repositoryClass=PairUnitRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['pair-unit:item_query']],
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['pair-unit:collection_query']],
        ],
        'update' => ['denormalization_context' => ['groups' => ['pair-unit:update-mutation']]],
        'cryptoCollection' => [
            'collection_query' => CryptoCollectionPairUnitResolver::class,
            'args' => [
                'exists' => ['type' => 'Iterable!'],
                'currency_tag' => ['type' => 'String!'],
                'isActive' => ['type' => 'Boolean!'],
                'selected' => ['type' => 'Int!'],
            ]
        ]
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read' => false,
            'output' => false
        ]
    ],
    attributes: [
        'pagination_type' => 'page',
        'order' => ['priority' => 'DESC']
    ]
)]
#[ApiFilter(BooleanFilter::class, properties: ['isActive'])]
#[ApiFilter(ExistsFilter::class, properties: ['pairUnitTabs'])]
#[ApiFilter(SearchFilter::class, properties: [
    'direction' => 'exact',
    'pairUnitTabs.name' => 'exact',
    'currency.tag' => 'exact',
    'currency.service.tag' => 'exact',
    'currency.service.name' => 'exact',
    'paymentSystem.name' => 'exact',
    'currency.asset' => 'partial',
])]
#[ApiFilter(RangeFilter::class, properties: ['fee.percent', 'fee.constant', 'fee.max', 'fee.min', 'priority'])]
#[ApiFilter(NumericFilter::class, properties: ['pairUnitTabs.id'])]
class PairUnit
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @ORM\ManyToOne(targetEntity=Currency::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?Currency $currency;

    /**
     * @var ?PaymentSystem
     * @ORM\ManyToOne(targetEntity=PaymentSystem::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?PaymentSystem $paymentSystem;

    /**
     * @var ?Fee
     * @ORM\ManyToOne(targetEntity=Fee::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private ?Fee $fee;

    /**
     * @var ?float
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private ?float $amount = 0;

    /**
     * @var ?float
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private ?float $min = 0;

    /**
     * @var ?float
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private ?float $max = 0;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=10, nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-details:collection_query"
     * })
     */
    private ?string $direction;

    /**
     * @var ?bool
     * @ORM\Column(type="boolean")
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     *      "pair-unit:update-mutation"
     * })
     */
    private ?bool $isActive;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({
     *      "pair-unit:collection_query",
     * })
     */
    private ?float $balance;

    /**
     * @ORM\Column(type="float", options={"default" : 0}, nullable=true)
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private ?float $dayChange = 0;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean")
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     *      "pair-unit:update-mutation"
     * })
     */
    private ?bool $isCardVerification;

    /**
     * @var float|null
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $surcharge = 0;

    /**
     * @var ?float
     * @ORM\Column(type="float", options={"default" : 0})
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     *      "pair-unit:update-mutation"
     * })
     */
    private ?float $price = 0;

    /**
     * @var ?PairUnitTab
     * @ORM\ManyToOne(targetEntity=PairUnitTab::class, inversedBy="pairUnit")
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     *      "pair-unit:update-mutation"
     * })
     */
    private ?PairUnitTab $pairUnitTabs;

    /**
     * @var ?int
     * @ORM\Column(type="integer", options={"default" : 0})
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     *      "pair-unit:update-mutation"
     * })
     */
    private ?int $priority = 0;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Pair::class, mappedBy="payment")
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private $paymentPairs;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Pair::class, mappedBy="payout")
     * @Groups({
     *      "pair-unit:collection_query",
     *      "pair-unit:item_query",
     * })
     */
    private $payoutPairs;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=BankDetail::class, mappedBy="pairUnit")
     */
    private $bankDetails;

    /**
     * @var bool|null
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?bool $isRateExchange = false;

    /**
     * @var float|null
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $exchangeRate = 0;

    /**
     * PairUnit constructor.
     */
    #[Pure] public function __construct()
    {
        $this->isActive = false;
        $this->dayChange = 0;
        $this->isCardVerification = false;
        $this->paymentPairs = new ArrayCollection();
        $this->payoutPairs = new ArrayCollection();
        $this->bankDetails = new ArrayCollection();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Currency|null
     */
    public function getCurrency(): ?Currency
    {
        return $this->currency;
    }

    /**
     * @param Currency|null $currency
     * @return $this
     */
    public function setCurrency(?Currency $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return PaymentSystem|null
     */
    public function getPaymentSystem(): ?PaymentSystem
    {
        return $this->paymentSystem;
    }

    /**
     * @param PaymentSystem|null $paymentSystem
     * @return $this
     */
    public function setPaymentSystem(?PaymentSystem $paymentSystem): self
    {
        $this->paymentSystem = $paymentSystem;

        return $this;
    }

    /**
     * @return Fee|null
     */
    public function getFee(): ?Fee
    {
        return $this->fee;
    }

    /**
     * @param Fee|null $fee
     * @return $this
     */
    public function setFee(?Fee $fee): self
    {
        $this->fee = $fee;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return $this
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getMin(): ?float
    {
        return $this->min;
    }

    /**
     * @param float $min
     * @return $this
     */
    public function setMin(float $min): self
    {
        $this->min = $min;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getMax(): ?float
    {
        return $this->max;
    }

    /**
     * @param float $max
     * @return $this
     */
    public function setMax(float $max): self
    {
        $this->max = $max;

        return $this;
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
     * @return bool|null
     */
    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     * @return $this
     */
    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getBalance(): ?float
    {
        return $this->balance;
    }

    /**
     * @param float|null $balance
     * @return $this
     */
    public function setBalance(?float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getDayChange(): ?float
    {
        return $this->dayChange;
    }

    /**
     * @param float|null $dayChange
     * @return $this
     */
    public function setDayChange(?float $dayChange): self
    {
        $this->dayChange = $dayChange;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsCardVerification(): ?bool
    {
        return $this->isCardVerification;
    }

    /**
     * @param bool $isCardVerification
     * @return $this
     */
    public function setIsCardVerification(bool $isCardVerification): self
    {
        $this->isCardVerification = $isCardVerification;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getLastFee(): ?float
    {
        return $this->lastFee;
    }

    /**
     * @param float $lastFee
     * @return $this
     */
    public function setLastFee(float $lastFee): self
    {
        $this->lastFee = $lastFee;

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
     * @return PairUnitTab|null
     */
    public function getPairUnitTabs(): ?PairUnitTab
    {
        return $this->pairUnitTabs;
    }

    /**
     * @param PairUnitTab|null $pairUnitTabs
     * @return $this
     */
    public function setPairUnitTabs(?PairUnitTab $pairUnitTabs): self
    {
        $this->pairUnitTabs = $pairUnitTabs;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getPriority(): ?int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     * @return $this
     */
    public function setPriority(int $priority): self
    {
        $this->priority = $priority;

        return $this;
    }


    /**
     * @return Collection
     */
    public function getPaymentPairs(): Collection
    {
        return $this->paymentPairs;
    }

    /**
     * @param Pair $paymentPair
     * @return $this
     */
    public function addPaymentPair(Pair $paymentPair): self
    {
        if (!$this->paymentPairs->contains($paymentPair)) {
            $this->paymentPairs[] = $paymentPair;
            $paymentPair->setPayment($this);
        }

        return $this;
    }

    /**
     * @param Pair $paymentPair
     * @return $this
     */
    public function removePaymentPair(Pair $paymentPair): self
    {
        if ($this->paymentPairs->removeElement($paymentPair)) {
            // set the owning side to null (unless already changed)
            if ($paymentPair->getPayment() === $this) {
                $paymentPair->setPayment(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection
     */
    public function getPayoutPairs(): Collection
    {
        return $this->payoutPairs;
    }

    /**
     * @param Pair $payoutPair
     * @return $this
     */
    public function addPayoutPair(Pair $payoutPair): self
    {
        if (!$this->payoutPairs->contains($payoutPair)) {
            $this->payoutPairs[] = $payoutPair;
            $payoutPair->setPayout($this);
        }

        return $this;
    }

    /**
     * @param Pair $payoutPair
     * @return $this
     */
    public function removePayoutPair(Pair $payoutPair): self
    {
        if ($this->payoutPairs->removeElement($payoutPair)) {
            // set the owning side to null (unless already changed)
            if ($payoutPair->getPayout() === $this) {
                $payoutPair->setPayout(null);
            }
        }

        return $this;
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
            $bankDetail->setPairUnit($this);
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
            if ($bankDetail->getPairUnit() === $this) {
                $bankDetail->setPairUnit(null);
            }
        }

        return $this;
    }

    /**
     * @return float|null
     */
    public function getSurcharge(): ?float
    {
        return $this->surcharge;
    }

    /**
     * @param float $surcharge
     * @return $this
     */
    public function setSurcharge(float $surcharge): self
    {
        $this->surcharge = $surcharge;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsRateExchange(): ?bool
    {
        return $this->isRateExchange;
    }

    /**
     * @param bool $isRateExchange
     * @return $this
     */
    public function setIsRateExchange(bool $isRateExchange): self
    {
        $this->isRateExchange = $isRateExchange;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getExchangeRate(): ?float
    {
        return $this->exchangeRate;
    }

    /**
     * @param float $exchangeRate
     * @return $this
     */
    public function setExchangeRate(float $exchangeRate): self
    {
        $this->exchangeRate = $exchangeRate;

        return $this;
    }
}
