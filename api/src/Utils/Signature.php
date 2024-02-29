<?php

namespace App\Utils;

/**
 * Class Signature
 * @package App\Utils
 */
class Signature
{
    /**
     * @param string $data
     * @param string $signature
     * @param string $key
     * @return bool
     */
    public static function check(string $data, string $signature, string $key): bool
    {
        $hash = base64_encode(hash_hmac('sha256', $data, $key, true));

        if ($hash != $signature) {
            return false;
        }
        return true;
    }
}