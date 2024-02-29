<?php


namespace App\EntityListener;


use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Doctrine\ORM\Event\LifecycleEventArgs;

class UserEntityListener
{
    /**
     * @var \Symfony\Component\Mailer\MailerInterface
     */
    protected \Symfony\Component\Mailer\MailerInterface $mailer;

    /**
     * @param \Symfony\Component\Mailer\MailerInterface $mailer
     */
    public function __construct(\Symfony\Component\Mailer\MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @param User $user
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function postPersist(User $user)
    {

        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Register on site')
            ->htmlTemplate("emails/client_registration.html.twig")
            ->context(['user' => $user, 'password' => $user->getGeneratedPassword()
            ]);

        $this->mailer->send($email);
    }

    /**
     * @param User $user
     * @param LifecycleEventArgs $eventArgs
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function postUpdate(User $user, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($user);
        if (isset($changeSets['isEnabled'])) {
            $subject = 'Confirmation';
            $template = 'confirmation.html.twig';
            $this->confirmEmail($user, $subject, $template);
        }
        if (isset($changeSets['password'])) {
            $subject = 'Password change confirmation';
            $template = 'change_password.html.twig';
            $this->confirmEmail($user, $subject, $template);
        }
    }

    /**
     * @param User $user
     * @param $subject
     * @param $template
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function confirmEmail(User $user, $subject, $template)
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject($subject)
            ->htmlTemplate("emails/{$template}")
            ->context(['user' => $user]);

        $this->mailer->send($email);
    }

}