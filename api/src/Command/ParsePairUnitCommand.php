<?php

namespace App\Command;

use App\Entity\Currency;
use App\Entity\Fee;
use App\Entity\PairUnit;
use App\Entity\PaymentSystem;
use App\Entity\Service;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Fee\getAll;
use ItlabStudio\ApiClient\Service\ApiClient;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ParsePairUnitCommand',
    description: 'Add a short description for your command',
)]
class ParsePairUnitCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'ParsePairUnit';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * ParsePairUnitCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     * @param null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        $name = null
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
        $em = $this->entityManager;
        $api = $this->apiClient;
        $response = $api->ControlPanel()->Fee()->getAll()->getData()->toArray();
        array_walk(
            $response,
            static function ($value) use ($em, $api) {
                if ($value instanceof getAll) {
                    $baseFee = $value->getBaseFee();

                    $service = $em->getRepository(Service::class)->findOneBy(
                        ['tag' => $baseFee->getService()->getTag()]
                    );

                    if (!$service) {
                        $service = new Service();
                        $service->setTag($baseFee->getService()->getTag());

                        $connections = $api->ControlPanel()->Connection()->getAll()->getData();
                        $connection = null;

                        foreach ($connections as $item) {
                            if ($item['service']['tag'] === $baseFee->getService()->getTag()) {
                                $connection = $item['id'];
                            }
                        }

//                        $connection = $api->ControlPanel()->Connection()->setFilter(
//                            "service.tag",
//                            $baseFee->getService()->getTag()
//                        )->getAll()->getData()->first();

                        if (!$connection) {
                            return;
                        }

//                        $service->setConnection(Uuid::fromString($connection->getId()));
                        $service->setConnection(Uuid::fromString($connection));
                        $em->persist($service);
                        $em->flush();
                    }

                    $currency = $em->getRepository(Currency::class)->findCurrency(
                        $baseFee->getService()->getTag(),
                        $baseFee->getCurrency()->getAsset()
                    );

                    if (!$currency) {
                        $currency = new Currency();
                        $currency->setAsset($baseFee->getCurrency()->getAsset());
                        $currency->setTag($baseFee->getCurrency()->getType());
                        $currency->setService($service);
                        $em->persist($currency);
                        $em->flush();
                    }

                    $paymentSystem = $em->getRepository(PaymentSystem::class)->findOneBy(
                        ['name' => $baseFee->getPaymentSystem()->getName()]
                    );

                    if (!$paymentSystem) {
                        $paymentSystem = new PaymentSystem();
                        $paymentSystem->setName($baseFee->getPaymentSystem()->getName());
                        $paymentSystem->setSubName($baseFee->getPaymentSystem()->getSubName());
                        $paymentSystem->setTag($baseFee->getPaymentSystem()->getTag());

                        $em->persist($paymentSystem);
                        $em->flush();
                    }

                    $fee = new Fee();
                    $fee->setPercent($value->getPercent() * 100);
                    $fee->setConstant($value->getConstant());
                    $fee->setMin($value->getMin());
                    $fee->setMax($value->getMax());
                    $em->persist($fee);
                    $em->flush();

                    $pairUnit = $em->getRepository(PairUnit::class)->findOneBy(
                        [
                            'currency'      => $currency,
                            'paymentSystem' => $paymentSystem,
                            'direction'     => $baseFee->getFeeType()["name"]
                        ]
                    );

                    if (!$pairUnit) {
                        $pairUnit = new PairUnit();
                        $pairUnit->setCurrency($currency);
                        $pairUnit->setPaymentSystem($paymentSystem);
                        $pairUnit->setDirection($baseFee->getFeeType()["name"]);

                        $pairUnit->setFee($fee);

//                    $flow = $api->ControlPanel()->Payment()->verification(
//                        [
//                            'paymentSystem' => $pairUnit->getPaymentSystem()->getSubName(),
//                            'currency' => $pairUnit->getCurrency()->getAsset(),
//                            'connection' => $pairUnit->getService()->getConnection()
//                        ]
//                    )->getData()->first();
//
//                    if ($flow->getFlow()) {
//                        $verificationSchema = $em->getRepository(VerificationSchema::class)->findOneBy(
//                            ['name' => $flow->getFlow()]
//                        );
//                        if (!$verificationSchema) {
//                            $verificationSchema = new VerificationSchema();
//                            $verificationSchema->setName($flow->getFlow());
//                            $em->persist($verificationSchema);
//                            $em->flush();
//                        }
//                        $pairUnit->setVerificationSchema($verificationSchema);
//                    }
                        $em->persist($pairUnit);
                        $em->flush();
                    }
                }
            }
        );

        $io->success('Exchange attribute was successfully inserted to database');

        return Command::SUCCESS;
    }
}
