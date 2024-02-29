<?php


namespace App\Command;


use App\Entity\Currency;
use App\Entity\Requisition;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'CronRequisitionTimer',
    description: 'Cron command checks the time of creation of the requisition, if it came out the requisition is closed by system',
)]
class CronRequisitionTimer extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'CronRequisitionTimer';

    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;

    /**
     * CronRequisitionTimer constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(\Doctrine\ORM\EntityManagerInterface $entityManager, string $name = null)
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

        $requisitionBankFiveDay = $this->entityManager->getRepository(Requisition::class)->requisitionTimerFiveDays();
        $requisitionBank = $this->entityManager->getRepository(Requisition::class)->requisitionTimer('-1 days', 'bank', Currency::TYPE_CRYPTO);

        /** @var Requisition $requisition */
        $requisitions = array_merge( $requisitionBank, $requisitionBankFiveDay );

        $count = count($requisitions);

        if ($count) {
            foreach ($requisitions as $requisition) {
                $requisition->setStatus(Requisition::STATUS_DISABLED);
                $this->entityManager->persist($requisition);
            }
            $this->entityManager->flush();
        }

        $io->success("$count requisition was bee disabled");

        return Command::SUCCESS;
    }
}