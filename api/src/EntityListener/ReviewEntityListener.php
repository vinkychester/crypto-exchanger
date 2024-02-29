<?php


namespace App\EntityListener;

use App\Entity\Review;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * Class ReviewEntityListener
 * @package App\EntityListener
 */
class ReviewEntityListener
{
    /**
     * @param Review $review
     */
    public function postPersist(Review $review)
    {
        //Todo
    }

    /**
     * @param Review $review
     * @param LifecycleEventArgs $eventArgs
     */
    public function postUpdate(Review $review, LifecycleEventArgs $eventArgs)
    {
        //Todo
    }

    /**
     * @param Review $review
     */
    public function preRemove(Review $review)
    {
        //Todo
    }
}