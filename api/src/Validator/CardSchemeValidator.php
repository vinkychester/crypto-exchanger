<?php


namespace App\Validator;


use App\Service\Credit\CreditService;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

/**
 * Class CardSchemeValidator
 * @package App\Validator
 */
class CardSchemeValidator extends ConstraintValidator
{
    /**
     * @param mixed $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof CardScheme) {
            throw new UnexpectedTypeException($constraint, CardScheme::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            throw new UnexpectedValueException($value, 'string');
        }

        $card = CreditService::validCreditCard($value, [
            CreditService::TYPE_VISA,
            CreditService::TYPE_MASTERCARD,
            CreditService::TYPE_VISA_ELECTRON,
            CreditService::TYPE_MIR,
            CreditService::TYPE_MAESTRO,
            CreditService::TYPE_UNIONPAY,
            CreditService::TYPE_DISCOVER
        ]);

        if (!$card["valid"]) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}