<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use App\Repository\PairUnitTabRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=PairUnitTabRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['tabs:item_query']],
            'security' => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['tabs:collection_query']],
            'security' => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
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
#[ApiFilter(ExistsFilter::class, properties: ['name'])]
class PairUnitTab
{
    public const PAIR_UNIT_TABS = ["bank", "payments", "coin"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=16)
     * @Groups({"tabs:collection_query", "tabs:item_query", "pair-unit:collection_query"})
     */
    private ?string $name;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=PairUnit::class, mappedBy="pairUnitTabs")
     */
    private $pairUnit;

    /**
     * PairUnitTab constructor.
     */
    #[Pure] public function __construct()
    {
        $this->pairUnit = new ArrayCollection();
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
     * @return Collection
     */
    public function getPairUnit(): Collection
    {
        return $this->pairUnit;
    }

    /**
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function addPairUnit(PairUnit $pairUnit): self
    {
        if (!$this->pairUnit->contains($pairUnit)) {
            $this->pairUnit[] = $pairUnit;
            $pairUnit->setPairUnitTabs($this);
        }

        return $this;
    }

    /**
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function removePairUnit(PairUnit $pairUnit): self
    {
        if ($this->pairUnit->removeElement($pairUnit)) {
            // set the owning side to null (unless already changed)
            if ($pairUnit->getPairUnitTabs() === $this) {
                $pairUnit->setPairUnitTabs(null);
            }
        }

        return $this;
    }
}
