<?php


namespace App\Resolver\Mutation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Service\Validation\AttributeValidationSingleton;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class CreateBankDetailMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CreateBankDetailMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param BankDetail $item
     * @param array $context
     * @return BankDetail
     */
    public function __invoke($item, array $context): BankDetail
    {
        $attributes = $context['args']['input']['attributes'];
        $em = $this->entityManager;

        $errors = [];
        array_walk(
            $attributes,
            static function ($value) use ($item, $em, &$errors) {
                $name = ucfirst($value['name']);
                $method = "validate{$name}";
                if ($value['name'] === "wallet") {
                    $attribute = $em->getRepository(BankDetail::class)->findWallet(
                        $item->getClient(),
                        $item->getPairUnit(),
                        $value['value'],
                        $item->getDirection()
                    );
                    if ($attribute !== null) {
                        $errors["wallet"] = "Such a purse exists";
                    }
                }
                AttributeValidationSingleton::getInstance()->$method($value['value'], $errors);

                $attribute = new Attribute();
                $attribute
                    ->setName($value['name'])
                    ->setValue($value['value'])
                    ->setIsHidden($value['isHidden'])
                    ->setBankDetail($item);
                $em->persist($attribute);
            }
        );

        if (count($errors)) {
            throw new \RuntimeException(json_encode($errors), Response::HTTP_NOT_ACCEPTABLE);
        }

        return $item;
    }
}