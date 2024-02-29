<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Class HashPasswordListener
 * @package App\EventListener
 */
class HashPasswordListener implements EventSubscriber
{
    /**
     * @var ComputerPasswordGenerator
     */
    private ComputerPasswordGenerator $generator;
    /**
     * @var UserPasswordHasherInterface
     */
    private UserPasswordHasherInterface $passwordHasher;

    /**
     * HashPasswordListener constructor.
     * @param UserPasswordHasherInterface $passwordHasher
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->generator = new ComputerPasswordGenerator();
        $this->generator->setLength(16);
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @return array
     */
    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist
        ];
    }

    /**
     * @param User $user
     * @param LifecycleEventArgs $event
     */
    public function prePersist(User $user, LifecycleEventArgs $event): void
    {
        $password = $this->generator->generatePassword();
        $user->setGeneratedPassword($password);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
    }
}