<?php


namespace App\Service\FeedbackBuilder;


use App\Entity\FeedbackMessage;

interface FeedbackDetailBuilderInterface
{

    /**
     * @param FeedbackMessage $feedbackMessage
     * @param array $context
     * @return $this
     */
    public function setFeedbackDetails(FeedbackMessage $feedbackMessage, array $context): static;

    /**
     * @return $this
     */
    public function storeFeedbackDetails(): static;
}