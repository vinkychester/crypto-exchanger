<?php


namespace App\EntityListener;


use App\Entity\FeedbackDetail;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class FeedbackDetailEntityListener
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;

    /**
     * FeedbackDetailEntityListener constructor.
     * @param EntityManagerInterface $entityManager
     * @param MailerInterface $mailer
     */
    public function __construct(EntityManagerInterface $entityManager, MailerInterface $mailer)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    /**
     * @param FeedbackDetail $feedbackDetail
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function postPersist(FeedbackDetail $feedbackDetail)
    {
        $question = $this->entityManager->getRepository(FeedbackDetail::class)->findBy(
            [
                'author'          => FeedbackDetail::CLIENT,
                'feedbackMessage' => $feedbackDetail->getFeedbackMessage()
            ],
            ['createdAt' => 'DESC']
        );

        if ($feedbackDetail->getAuthor() === FeedbackDetail::ADMIN) {
            $email = (new TemplatedEmail())
                ->to($feedbackDetail->getFeedbackMessage()->getEmail())
                ->from(new Address($_ENV['PROD_LOGIN'], 'buycoin.cash'))
                ->subject('Non-cash payment')
                ->htmlTemplate("emails/feedback-answer.html.twig")
                ->context(
                    [
                        'question' => count($question) ? $question[0]->getMessage(
                        ) : $feedbackDetail->getFeedbackMessage()->getMessage(),
                        'answer'   => $feedbackDetail->getMessage()
                    ]
                );
            $this->mailer->send($email);
        }
    }
}