<?php


namespace App\Security;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use http\Exception\RuntimeException;
use JetBrains\PhpStorm\ArrayShape;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Google\Client as GoogleClient;

/**
 * Class GoogleAuthenticator
 * @package App\Security
 */
class GoogleAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var JWTTokenManagerInterface
     */
    protected JWTTokenManagerInterface $tokenManager;
    /**
     * @var GoogleClient
     */
    private GoogleClient $googleClient;

    /**
     * GoogleAuthenticator constructor.
     * @param EntityManagerInterface $entityManager
     * @param JWTTokenManagerInterface $tokenManager
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $tokenManager
    )
    {
        $this->entityManager = $entityManager;
        $this->tokenManager = $tokenManager;
        $this->googleClient = new GoogleClient(['client_id' => $_ENV['GOOGLE_CLIENT_ID']]);
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse
     */
    public function start(Request $request, AuthenticationException $authException = null): JsonResponse
    {
        return new JsonResponse(['message' => 'Authentication Required'], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @throws \JsonException
     */
    public function supports(Request $request): bool
    {
        $response = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return isset($response["tokenId"], $response["email"]);
    }

    /**
     * @param Request $request
     * @return array
     * @throws \JsonException
     */
    #[ArrayShape(['email' => "mixed", 'tokenId' => "mixed"])] public function getCredentials(Request $request): array
    {
        $response = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return [
            'email' => $response["email"],
            'tokenId' => $response["tokenId"]
        ];
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return User|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider): ?User
    {
        if (null === $credentials) {
            return null;
        }

        $email = $credentials['email'];
        $tokenId = $credentials['tokenId'];

        $payload = $this->googleClient->verifyIdToken($tokenId);

        if (!$payload || $email !== $payload['email']) {
            return null;
        }

        try {
            /** @var User $user */
            $user = $userProvider->loadUserByIdentifier($email);
            if ($user->getIsGoogleAuthenticatorEnabled()) {
                return $user;
            }
        } catch (\Exception $exception) {
            $user = new User();
            $this->entityManager->persist($user
                ->setFirstname($payload["given_name"])
                ->setLastname($payload["family_name"])
                ->setEmail($payload["email"])
                ->setIsEnabled(true)
                ->setRoles(User::ROLE_CLIENT)
            );
            $this->entityManager->flush();
        }

        return $user;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        if ($user->getIsBanned()) {
            throw new RuntimeException('', 409);
        }

        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        $data = ['message' => strtr($exception->getMessageKey(), $exception->getMessageData())];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return JsonResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey): JsonResponse
    {
        /** @var User $user */
        $user = $token->getUser();
        if ($user instanceof UserInterface) {
            if ($user->getIsGoogleAuthenticatorEnabled()) {
                return new JsonResponse(['id' => $user->getId()], Response::HTTP_OK);
            }
            return new JsonResponse(['token' => $this->tokenManager->create($user)], Response::HTTP_OK);
        }

        return new JsonResponse(['id' => $user->getId()], Response::HTTP_OK);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe(): bool
    {
        return false;
    }
}