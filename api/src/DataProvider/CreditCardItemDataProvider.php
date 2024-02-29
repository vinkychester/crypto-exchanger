<?php


namespace App\DataProvider;


/**
 * Class CreditCardItemDataProvider
 * @package App\DataProvider
 */
class CreditCardItemDataProvider implements
    \ApiPlatform\Core\DataProvider\ItemDataProviderInterface,
    \ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface
{
    private \Doctrine\Persistence\ManagerRegistry $managerRegistry;
    private \App\Utils\Base64FileExtractor $base64FileExtractor;
    /**
     * @var string
     */
    private string $creditDir;

    /**
     * CreditCardItemDataProvider constructor.
     * @param \Doctrine\Persistence\ManagerRegistry $managerRegistry
     * @param \App\Utils\Base64FileExtractor $base64FileExtractor
     * @param string $creditDir
     * @param iterable $itemExtensions
     */
    public function __construct(
        \Doctrine\Persistence\ManagerRegistry $managerRegistry,
        \App\Utils\Base64FileExtractor $base64FileExtractor,
        string $creditDir,
        iterable $itemExtensions = [])
    {
        $this->managerRegistry = $managerRegistry;
        $this->base64FileExtractor = $base64FileExtractor;
        $this->creditDir = $creditDir;
    }

    /**
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return \App\Entity\CreditCard::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return object|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?object
    {
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        $base64FileExtractor = $this->base64FileExtractor;
        $storageDir = $this->creditDir;
        /** @var \App\Entity\CreditCard $creditCard */
        $creditCard = $manager->getRepository($resourceClass)->find($id);
        $attachments = $creditCard->getMediaObjects()->getValues();
        array_walk($attachments, static function ($value) use ($base64FileExtractor, $storageDir) {
            $value->setBase64($base64FileExtractor->convertToBase64($storageDir . $value->getStorage() . '/' . $value->getContentUrl()));
        });
        return $creditCard;
    }

}