<?php

namespace App\Resolver\Mutation;

use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\User;
use Exception;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class AccountChangePasswordMutationResolver
 * @package App\Resolver
 */
class AccountChangePasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface
     */
    private \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder;

    /**
     * @var \ApiPlatform\Core\Validator\ValidatorInterface
     */
    protected \ApiPlatform\Core\Validator\ValidatorInterface $validator;

    /**
     * AccountChangePasswordMutationResolver constructor.
     * @param \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder
     * @param \ApiPlatform\Core\Validator\ValidatorInterface $validator
     */
    public function __construct(
        \Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface $passwordEncoder,
        \ApiPlatform\Core\Validator\ValidatorInterface                        $validator,
    ) {
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
        $args = $context['args']['input'];
        try {
            $newRetypedPassword = $args['newRetypedPassword'];
        } catch (RuntimeException $exception) {
            throw new RuntimeException('Required fields are missing.', Response::HTTP_BAD_REQUEST);
        }

        $context['groups'] = 'user:change-password';
        $this->validator->validate($item, $context);

        $item->setToken(bin2hex(random_bytes(15)));
        $item->setPassword($this->passwordEncoder->encodePassword($item, $newRetypedPassword));

        return $item;
    }
}
