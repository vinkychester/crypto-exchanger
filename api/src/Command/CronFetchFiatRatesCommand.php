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
    name: 'CronFetchFiatRates',
    description: 'Add a short description for your command',
)]
class CronFetchFiatRatesCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'CronFetchFiatRates';

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

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $availableCurrencies = $this->entityManager->getRepository(Currency::class)
            ->findBy(['tag' => Currency::TYPE_CURRENCY]);

        try {
            (new RateBuilder($this->entityManager))
                ->setAvailableCurrencies($availableCurrencies)
                ->setItems(
                    $this->apiClient->ControlPanel()->Rate()
                        ->setFilter('currency.type', Currency::TYPE_CURRENCY)
                        ->getAll()->getData()
                )
                ->storeItems();
        } catch (\Exception $e) {
            $io->error('Your command failed or have been executed partially. Error message:' . $e->getMessage());

            return Command::FAILURE;
        }


        $io->success('Fiat rates have been successfully inserted to database. Time: ' . date("Y-m-d H:i:s"));

        return Command::SUCCESS;
    }
}
