<?php


namespace App\Service\FeedbackBuilder;


use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;

class FeedbackDetailBuilder implements FeedbackDetailBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ValidatorInterface
     */
    protected ValidatorInterface $validator;

    /**
     * FeedbackDetailBuilder constructor.
     * @param EntityManagerInterface $entityManager
     * @param ValidatorInterface $validator
     */
    public function __construct(EntityManagerInterface $entityManager, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    /**
     * @param FeedbackMessage $feedbackMessage
     * @param array $context
     * @return $this
     */
    public function setFeedbackDetails(FeedbackMessage $feedbackMessage, array $context): static
    {
        $message = $context['args']['input']['message'];
        $feedbackDetail = new FeedbackDetail();
        $feedbackDetail->setAuthor(FeedbackDetail::CLIENT)
            ->setMessage($message)
            ->setFeedbackMessage($feedbackMessage);

        $this->validator->validate($feedbackDetail, $context);

        $this->entityManager->persist($feedbackDetail);

        return $this;
    }

    /**
     * @return $this
     */
    public function storeFeedbackDetails(): static
    {
        $this->entityManager->flush();

        return $this;
    }
}