<?php


namespace App\Security;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use JetBrains\PhpStorm\ArrayShape;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class GoogleTwoFactorsAuthenticator
 * @package App\Security
 */
class GoogleTwoFactorsAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var JWTTokenManagerInterface
     */
    private JWTTokenManagerInterface $manager;

    /**
     * GoogleTwoFactorsAuthenticator constructor.
     * @param EntityManagerInterface $entityManager
     * @param JWTTokenManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $entityManager, JWTTokenManagerInterface $manager)
    {
        $this->entityManager = $entityManager;
        $this->manager = $manager;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse
     */
    public function start(Request $request, AuthenticationException $authException = null): JsonResponse
    {
        $data = ['message' => 'Authentication Required'];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request): bool
    {
        $response = json_decode($request->getContent());

        return isset($response->id, $response->code);
    }

    /**
     * @param Request $request
     * @return array
     */
    #[ArrayShape(['id' => "mixed", 'code' => "mixed"])] public function getCredentials(Request $request): array
    {
        $response = json_decode($request->getContent());

        return [
            'id'   => $response->id,
            'code' => $response->code
        ];
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return object|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider): ?object
    {
        if (!$credentials) {
            return null;
        }

        return $this->entityManager->getRepository(User::class)->findOneBy(['id' => $credentials['id']]);
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        $google = new \Google\Authenticator\GoogleAuthenticator();

        if ($google->checkCode($user->getGoogleAuthenticatorSecret(), $credentials['code'])) {
            setcookie($_ENV['TWO_FACTOR_COOKIE'], '', 10);   // remove cookies after login
            return true;
        }

        if (isset($_COOKIE[$_ENV['TWO_FACTOR_COOKIE']])) {
            $decodeCountEnters = json_decode(base64_decode($_COOKIE[$_ENV['TWO_FACTOR_COOKIE']]))->data + 1;

            if ($decodeCountEnters >= 10) {
                $this->entityManager->persist($user->setIsBanned(true));
                $this->entityManager->flush();

                setcookie($_ENV['TWO_FACTOR_COOKIE'], '', 10);   // remove cookies after ban.

                throw new HttpException(409);
            } else {
                $expiry = json_decode(base64_decode($_COOKIE[$_ENV['TWO_FACTOR_COOKIE']]))->expiry;
                $cookieData = (object)array("data" => $decodeCountEnters, "expiry" => $expiry);
                setcookie($_ENV['TWO_FACTOR_COOKIE'], base64_encode(json_encode($cookieData)), $expiry);
            }
        } else {
            $expiry = time() + 3600 * 24;
            $cookieData = (object)array("data" => 1, "expiry" => $expiry);
            setcookie($_ENV['TWO_FACTOR_COOKIE'], base64_encode(json_encode($cookieData)), $expiry);
        }

        return false;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        throw new AccessDeniedHttpException('Invalid auth code');
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return JsonResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey): JsonResponse
    {
        return new JsonResponse(['token' => $this->manager->create($token->getUser())], Response::HTTP_OK);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe(): bool
    {
        return false;
    }
}