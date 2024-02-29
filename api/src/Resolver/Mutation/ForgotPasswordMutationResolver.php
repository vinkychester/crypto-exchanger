<?php


namespace App\Resolver\Mutation;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Exception;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

/**
 * Class ForgotPasswordMutationResolver
 * @package App\Resolver
 */
class ForgotPasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    private \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * @var \Symfony\Component\Mailer\MailerInterface
     */
    protected \Symfony\Component\Mailer\MailerInterface $mailer;

    /**
     * ForgotPasswordMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \Symfony\Component\Mailer\MailerInterface $mailer
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface      $entityManager,
        \Symfony\Component\Mailer\MailerInterface $mailer
    )
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return User
     * @throws Exception
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */

    public function __invoke($item, array $context): User
    {
        $email = $context["args"]["input"]["email"];
        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->findOneBy(["email" => $email]);

        if (null === $user) {
            throw new \RuntimeException("User not found in the system", 400);
        }
        if (!$user->getIsEnabled()) {
            throw new \RuntimeException("Email address not verified", 400);
        }

        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Forgot password')
            ->htmlTemplate("emails/forgot_password.html.twig")
            ->context(['user' => $user]);

        $this->mailer->send($email);
        return $user;
    }
}