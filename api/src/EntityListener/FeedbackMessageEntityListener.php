<?php


namespace App\EntityListener;


use App\Entity\FeedbackMessage;
use Doctrine\ORM\Event\LifecycleEventArgs;


class FeedbackMessageEntityListener
{

    public function postPersist(FeedbackMessage $feedbackMessage)
    {
        //Todo
    }

    public function postUpdate(FeedbackMessage $feedbackMessage, LifecycleEventArgs $eventArgs)
    {
        //Todo
    }

    public function postRemove(FeedbackMessage $feedbackMessage)
    {
        //Todo
    }


}