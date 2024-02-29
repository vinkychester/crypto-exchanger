<?php


namespace App\Resolver\Query;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Attribute;
use App\Entity\PairUnit;
use ItlabStudio\ApiClient\Service\ApiClient;

/**
 * Class AttributeCollectionQueryResolver
 * @package App\Resolver
 */
class AttributeCollectionQueryResolver implements QueryCollectionResolverInterface
{

    private \Doctrine\ORM\EntityManagerInterface $entityManager;
    private ApiClient $apiClient;

    /**
     * AttributeCollectionQueryResolver constructor.
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     */
    public function __construct(\Doctrine\ORM\EntityManagerInterface $entityManager, ApiClient $apiClient)
    {
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    /**
     * @param iterable<Attribute> $collection
     *
     * @return iterable<Attribute>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $collection = [];
        $args = $context['args'];
        $direction = $args['direction'];
        $locale = $args['locale'];

        /** @var PairUnit $pairUnit */
        $pairUnit = $this->entityManager->getRepository(PairUnit::class)->find($args['pairUnit_id']);

        $class = ucfirst($direction);
        $attributePrerequestContent = $this->apiClient->ControlPanel()->$class()->attributePrerequest([
            "paymentSystem" => $pairUnit->getPaymentSystem()->getSubName(),
            "currency" => $pairUnit->getCurrency()->getAsset(),
            "connection" => $pairUnit->getCurrency()->getService()->getConnection(),
            "locale" => $locale
        ])->getData()->toArray();

        if ($attributePrerequestContent) {
            array_walk($attributePrerequestContent, static function ($value, $key) use ($direction, &$collection) {
                $attributePrerequest = new Attribute();
                $attributePrerequest
                    ->setId(++$key)
                    ->setName($value->getName())
                    ->setFieldType($value->getFieldType())
                    ->setTitle($value->getTitle())
                    ->setDirection($direction);
                $collection[] = $attributePrerequest;
            });
        }

        return $collection;
    }
}