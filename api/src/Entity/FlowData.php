<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\FlowDataRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=FlowDataRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['flow:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['flow:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_FULLY')"
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ]
    ],
    attributes: ['pagination_enabled' => false]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'status' => 'exact',
    'invoice.id' => 'exact',
    'invoice.requisition.id' => 'exact',
])]
class FlowData
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=28)
     * @Groups({
     *     "flow:item_query",
     *     "flow:collection_query",
     *     "invoice:item_query",
     *     "invoice:collection_query"
     * })
     */
    private ?string $name;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=100)
     * @Groups({
     *     "flow:item_query",
     *     "flow:collection_query",
     *     "invoice:item_query",
     *     "invoice:collection_query"
     * })
     */
    private ?string $value;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     */
    private ?string $status;

    /**
     * @var Invoice|null
     * @ORM\ManyToOne(targetEntity=Invoice::class, inversedBy="flowData", cascade={"persist"})
     */
    private ?Invoice $invoice;

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
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @param string $value
     * @return $this
     */
    public function setValue(string $value): self
    {
        $this->value = $value;

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
     * @return Invoice|null
     */
    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    /**
     * @param Invoice|null $invoice
     * @return $this
     */
    public function setInvoice(?Invoice $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }
}
