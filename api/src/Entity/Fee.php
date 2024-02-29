<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\FeeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=FeeRepository::class)
 */
#[ApiResource(
    collectionOperations: [],
    graphql: [
        'collection_query' => ['normalization_context' => ['groups' => ['fee:collection_query']]],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read'       => false,
            'output'     => false
        ],
    ],
)]
class Fee
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "fee:collection_query"
     * })
     */
    private ?float $percent;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "fee:collection_query"
     * })
     */
    private ?float $constant;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "fee:collection_query"
     * })
     */
    private ?float $max;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "fee:collection_query"
     * })
     */
    private ?float $min;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getPercent(): ?float
    {
        return $this->percent;
    }

    /**
     * @param float $percent
     * @return $this
     */
    public function setPercent(float $percent): self
    {
        $this->percent = $percent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getConstant(): ?float
    {
        return $this->constant;
    }

    /**
     * @param float $constant
     * @return $this
     */
    public function setConstant(float $constant): self
    {
        $this->constant = $constant;

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
}
