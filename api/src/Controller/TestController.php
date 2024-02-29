<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TestController
 * @package App\Controller
 */
class TestController extends AbstractController
{
    public function index(): Response
    {
        return new Response("", 200);
    }
}