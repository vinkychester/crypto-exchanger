<?php

namespace App\Resolver\Mutation;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\User;
use Exception;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class ChangePasswordMutationResolver
 * @package App\Resolver
 */
class ChangePasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;
    /**
     * @var \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface
     */
    private \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder;

    /**
     * @var \ApiPlatform\Core\Validator\ValidatorInterface
     */
    protected \ApiPlatform\Core\Validator\ValidatorInterface $validator;

    /**
     * ChangePasswordMutationResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     * @param \ApiPlatform\Core\Validator\ValidatorInterface $validator
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface                                  $entityManager,
        \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder,
        \ApiPlatform\Core\Validator\ValidatorInterface                        $validator
    )
    {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->validator = $validator;
    }

    /**
     * @param User|null $item
     * @param array $context
     * @return User
     * @throws Exception
     */
    public function __invoke($item, array $context): User
    {
        try {
            $args = $context['args']['input'];
            $newRetypedPassword = $args['newRetypedPassword'];
            $token = $args['token'];
        } catch (\RuntimeException $exception) {
            throw new \RuntimeException('Required fields are missed.', Response::HTTP_BAD_REQUEST);
        }
        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['token' => $token]);
        if (null === $user) {
            throw new \RuntimeException('Invalid confirmation token', Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword($newRetypedPassword);

        $context['groups'] = 'anonim:change-password';
        $this->validator->validate($item, $context);

        $user->setToken(bin2hex(random_bytes(15)));

        $user->setPassword($this->passwordEncoder->encodePassword($user, $newRetypedPassword));

        return $user;
    }
}
