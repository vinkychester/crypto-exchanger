<?php


namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

/**
 * Class FeeCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class FeeCallbackController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{
    /**
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function feeCallback(\Symfony\Component\HttpFoundation\Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $content = json_decode($request->getContent(), true);
        $data = $content['data'];
        $baseFee = $data['baseFee'];

        /** @var \App\Entity\PairUnit $pairUnit */
        $pairUnit = $this->getDoctrine()->getRepository(\App\Entity\PairUnit::class)->findPairUnit(
            $baseFee,
            $baseFee['feeType']['name']
        );

        if ($pairUnit) {
            /** @var \App\Entity\Fee $fee */
            $fee = $pairUnit->getFee();

            $fee->setConstant($data['constant']);
            $fee->setPercent($data['percent'] * 100);
            $fee->setMin($data['min']);
            $fee->setMax($data['max']);

            $this->getDoctrine()->getManager()->flush();
        }

        return new \Symfony\Component\HttpFoundation\Response("", 200);
    }
}