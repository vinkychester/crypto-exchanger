<?php

namespace App\Command;

use App\Entity\PairUnitTab;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'CreatePairUnitTabs',
    description: 'Add a short description for your command',
)]
class CreatePairUnitTabsCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'CreatePairUnitTabs';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CreatePairUnitTabsCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }


    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        foreach (PairUnitTab::PAIR_UNIT_TABS as $tab) {
            $pairUnitTab = new PairUnitTab();
            $pairUnitTab->setName($tab);

            $this->entityManager->persist($pairUnitTab);
        }
        $this->entityManager->flush();

        $io->success('Tabs wor pair units was inserted successfully');

        return Command::SUCCESS;
    }
}
