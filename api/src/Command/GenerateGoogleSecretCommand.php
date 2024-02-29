<?php

namespace App\Command;

use Google\Authenticator\GoogleAuthenticator;
use Google\Authenticator\GoogleQrUrl;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'GenerateGoogleSecretCommand',
    description: 'Add a short description for your command',
)]
class GenerateGoogleSecretCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'GenerateGoogleSecret';

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln([
            'Google Secret Creator',
            '============',
            '',
        ]);

        $helper = $this->getHelper('question');

        $domains = ['buycoin.dev.cash', 'dev8.itlab-studio.com', 'buycoin.cash'];
        $question = new Question('Enter Domain: ');
        $question->setAutocompleterValues($domains);
        $domain = $helper->ask($input, $output, $question);

        $roles = ['admin', 'manager', 'seo', 'client'];
        $question = new Question('Enter Role: ');
        $question->setAutocompleterValues($roles);
        $role = $helper->ask($input, $output, $question);

        $google = new GoogleAuthenticator();
        $secret = $google->generateSecret();
        $link = GoogleQrUrl::generate("{$domain} ({$role})", $secret);

        $io = new SymfonyStyle($input, $output);
        $io->section('Secret ' . $secret . "\nLink " . $link);

        return Command::SUCCESS;
    }
}
