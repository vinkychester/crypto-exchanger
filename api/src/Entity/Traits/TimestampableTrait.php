<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Adds created at and updated at timestamps to entities.
 * Entities using this must have HasLifecycleCallbacks annotation.
 * Trait TimestampableTrait
 * @package App\Entity\Traits
 * @ORM\HasLifecycleCallbacks
 */
trait TimestampableTrait
{
    /**
     * @var int $createdAt
     * @ORM\Column(name="created_at", type="integer")
     * @Groups({
     *     "user:collection_query",
     *     "user:item_query",
     *     "review:item_query",
     *     "review:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "feedback:collection_query",
     *     "feedback:item_query",
     *     "feedbackDetail:item_query",
     *     "requisition:item_query",
     *     "credit:collection_query",
     *     "credit:item_query"
     * })
     */
    private int $createdAt;

    /**
     * Gets triggered only on insert
     *
     * @ORM\PrePersist()
     * @throws \Exception
     */
    public function onCreatedAt(): void
    {
        $this->createdAt = time();
    }

    /**
     * Get createdAt
     *
     * @return int
     */
    public function getCreatedAt(): int
    {
        return $this->createdAt;
    }

    /**
     * @param int $createdAt
     * @return TimestampableTrait
     */
    public function setCreatedAt(int $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}