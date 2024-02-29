<?php

namespace App\Service\FlowData;

use App\Entity\FlowData;

/**
 * Class FlowDataService
 * @package App\Service\FlowData
 */
class FlowDataService
{

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \App\Entity\Invoice $invoice
     * @param $flowContent
     * @param string $status
     */
    public static function setFlowData(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \App\Entity\Invoice $invoice,
        $flowContent,
        string $status
    ) {
        $em = $entityManager;

        array_walk($flowContent, static function ($value, $key) use ($em, $invoice, $status, $flowContent) {
            /** @var \App\Entity\FlowData $flowData */
            $flowData = $em->getRepository(FlowData::class)->findOneBy([
                'name' => $key, 'value' => $value, 'invoice' => $invoice
            ]);

//            if ($key === "confirms") {
//                $value = "{$value} / {$flowContent['expectedConfirms']}";
//            }
//
//            if ($key === "expectedConfirms") {
//                return;
//            }

            if (!$flowData) {
                $flowData = $em->getRepository(FlowData::class)->findOneBy(['name' => $key, 'invoice' => $invoice]);
                if ($flowData) {
                    $flowData->setValue($value);
                } else {
                    $flowData = new FlowData();
                    $flowData
                        ->setName($key)
                        ->setValue($value)
                        ->setInvoice($invoice);
                }
            }
            $flowData->setStatus($status);
            $em->persist($flowData);

        });
        $em->flush();
    }
}