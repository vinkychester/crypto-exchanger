<?php

namespace App\Command;

use App\Entity\Currency;
use App\Service\RateBuilder\RateBuilder;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'CronFetchCryptoRates',
    description: 'Cron command to update crypto rates',
)]
class CronFetchCryptoRatesCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'CronFetchCryptoRates';

    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;
    /**
     * @var \ItlabStudio\ApiClient\Service\ApiClient
     */
    protected \ItlabStudio\ApiClient\Service\ApiClient $apiClient;

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \ItlabStudio\ApiClient\Service\ApiClient $apiClient
     * @param string|null $name
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \ItlabStudio\ApiClient\Service\ApiClient $apiClient,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $availableCurrencies = $this->entityManager->getRepository(Currency::class)->findBy(['tag' => Currency::TYPE_CRYPTO]);

        try {
            (new RateBuilder($this->entityManager))
                ->setAvailableCurrencies($availableCurrencies)
                ->setItems(
                    $this->apiClient->ControlPanel()->Rate()
                        ->setFilter('currency.type', Currency::TYPE_CRYPTO)
                        ->getAll()->getData()
                )
                ->storeItems();
        } catch (\Exception $e) {
            $io->error('Your command failed or have been executed partially. Error message:' . $e->getMessage());

            return Command::FAILURE;
        }

        $io->success('crypto rates have been successfully inserted to database. Time: ' . date("Y-m-d H:i:s"));

        return Command::SUCCESS;
    }
}
