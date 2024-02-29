<?php


namespace App\Resolver\Mutation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Entity\FeedbackMessage;
use App\Service\FeedbackBuilder\FeedbackDetailBuilder;

class FeedbackMessageMutationResolver implements MutationResolverInterface
{

    protected \Doctrine\ORM\EntityManagerInterface $entityManager;
    protected \ApiPlatform\Core\Validator\ValidatorInterface $validator;

    /**
     * FeedbackMessageMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \ApiPlatform\Core\Validator\ValidatorInterface $validator
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \ApiPlatform\Core\Validator\ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)
            ->findOneBy(
                [
                    'email'   => $args['email'],
                    'deleted' => false,
                ]
            );

        if ($feedbackMessage) {
            $feedbackMessage->setStatus(FeedbackMessage::NOT_VIEWED);
            $this->entityManager->persist($feedbackMessage);
            (new FeedbackDetailBuilder($this->entityManager, $this->validator))
                ->setFeedbackDetails($feedbackMessage, $context)
                ->storeFeedbackDetails();
        } else {
            /** @var FeedbackMessage $item */
            $item->setEmail($args['email'])
                ->setMessage($args['message'])
                ->setFirstname($args['firstname'])
                ->setLastname($args['lastname']);
            $this->validator->validate($item, $context);
            $this->entityManager->persist($item);
        }

        $this->entityManager->flush();

        return null;
    }
}