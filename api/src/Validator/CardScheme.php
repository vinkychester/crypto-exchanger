<?php


namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class CardScheme extends Constraint
{
    public string $message = 'Bank card is invalid';
}