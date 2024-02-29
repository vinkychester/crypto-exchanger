<?php


namespace App\Security;


use App\Entity\User;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class UserChecker
 * @package App\Security
 */
class UserChecker implements UserCheckerInterface
{
    /**
     * @var SessionInterface
     */
    protected SessionInterface $session;

    /**
     * @var RequestStack
     */
    protected RequestStack $requestStack;

    /**
     * @param SessionInterface $session
     * @param RequestStack $requestStack
     */
    public function __construct(SessionInterface $session, RequestStack $requestStack)
    {
        $this->session = $session;
        $this->requestStack = $requestStack;
    }

    /**
     * @param UserInterface $user
     * @return ?bool
     */
    public function checkPreAuth(UserInterface $user): ?bool
    {
        if (!$user instanceof User) {
            return null;
        }

        if (array_unique($user->getRoles()) == User::ROLE_CLIENT  && !$user->getIsEnabled()) {
            throw new AccessDeniedHttpException(
                'Your account is not activated, follow the link indicated in the registration letter or contact the administrator'
            );
        }

        return true;
    }

    /**
     * @param UserInterface $user
     */
    public function checkPostAuth(UserInterface $user)
    {
        // TODO: Implement checkPostAuth() method.
    }
}