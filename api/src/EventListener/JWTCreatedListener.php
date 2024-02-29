<?php


namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class JWTCreatedListener
 * @package App\EventListener
 */
class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreatedRequest(JWTCreatedEvent $event): void
    {
        /** @var $user User */
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }

        $role = match ($user->getRoles()) {
            [User::ROLE_CLIENT] => "client",
            [User::ROLE_SEO] => "seo",
            [User::ROLE_ADMIN] => "admin",
            default => "anonymous",
        };

        $payload['id'] = $user->getId();
        $payload['username'] = $user->getUsername();
        $payload['role'] = $role;
        $event->setData($payload);
    }
}