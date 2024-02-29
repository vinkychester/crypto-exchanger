<?php


namespace App\Resolver\Mutation;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Exception;
use App\Entity\User;

/**
 * Class ConfirmationMutationResolver
 * @package App\Resolver
 */
class ConfirmationMutationResolver implements MutationResolverInterface
{
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * ConfirmationMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface   $entityManager,
    )
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param User|null $item
     * @param array $context
     * @return User
     * @throws Exception
     */
    public function __invoke($item, array $context): User
    {
        $token = $context["args"]["input"]["token"];
        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->findOneBy(["token" => $token]);

        if (null === $user) {
            throw new \RuntimeException("Sorry, we couldn't verify your email address", 400);
        }

        if ($user->getIsEnabled()) {
            throw new \RuntimeException("This mail is already activated", 400);
        }

        $user->setIsEnabled(true);
        $user->setToken(bin2hex(random_bytes(15)));

        return $user;
    }
}