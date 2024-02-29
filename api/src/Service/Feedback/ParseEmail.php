<?php

namespace App\Service\Feedback;

use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use DOMDocument;
use PhpImap\Mailbox as ImapMailbox;

class ParseEmail
{

    /**
     * @var ImapMailbox
     */
    protected ImapMailbox $mailbox;

    /**
     * @var array|string[][]
     */
    protected array $problem_services = [
        'yandex.ru' => ['parseHtmlYandex', 'textHtml'],
        'ya.ru' => ['parseHtmlYandex', 'textHtml'],
        'outlook.com' => ['outlook', 'textPlain'],
        'hotmail.com' => ['outlook', 'textPlain'],
        'meta.ua' => ['metaUa', 'textPlain'],
        'online.ua' => ['parseHtmlOnline', 'textHtml'],
        'ukr.net' => ['parseHTML', 'textHtml']
    ];
    /**
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected \Doctrine\ORM\EntityManagerInterface $entityManager;
    /**
     * @var \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface
     */
    protected \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage;

    /**
     * @param \Doctrine\ORM\EntityManagerInterface $entityManager
     * @param \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage
     * @throws \PhpImap\Exceptions\InvalidParameterException
     */
    public function __construct(
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage
    ) {
        $this->mailbox = new ImapMailbox(
            "{185.141.192.66:143/imap/tls/novalidate-cert}INBOX",
            $_ENV['SUPPORT_EMAIL_LOGIN'],
            $_ENV['SUPPORT_EMAIL_PASSWORD']
        );

        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return int[]
     */
    public function getListOfMails()
    {
        $mailsIds = $this->mailbox->searchMailbox('UNSEEN');
        if ($mailsIds) {
            foreach ($mailsIds as $id) {
                $mail = $this->mailbox->getMail($id);
                $message = $this->checkEmail($mail->fromAddress, $mail);
                $this->saveMessage($message, $mail->fromAddress);
            }
            $this->mailbox->disconnect();
        }

        return $mailsIds;
    }

    /**
     * @param $email
     * @param $mail
     * @return string
     */
    private function checkEmail($email, $mail): string
    {
        if (array_key_exists(explode('@', $email)[1], $this->problem_services)) {
            $method = $this->problem_services[explode('@', $email)[1]][0];
            $methodEmail = $this->problem_services[explode('@', $email)[1]][1];
            $message = $this->$method($mail->$methodEmail);
        } else {
            $message = $this->onlyText($mail->textPlain);
        }

        return $message;
    }

    /**
     * @param $string
     * @return string
     */
    private function onlyText($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/\b[^\s]+@[^\s]+/', $line)) {
                break;
            }
            $message[] = $line;
        }

        return implode(PHP_EOL, $message);
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHTML($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->substituteEntities = true;
        $dom->encoding = 'UTF-8';
        $dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $dom->encoding = 'UTF-8';
        $dom->saveXML();
        $spans = $dom->getElementsByTagName('span');
        $message = '';
        foreach ($spans as $span) {
            $message .= $span->textContent;
        }

        return $this->onlyText($message);
    }

    /**
     * @param $message
     * @param $clientEmail
     */
    public function saveMessage($message, $clientEmail)
    {
        $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)->findOneBy(
            ['email' => $clientEmail]
        );
        if ($feedbackMessage && ($feedbackMessage->getStatus() !== FeedbackMessage::WELL_DONE)) {
            $this->saveFeedbackDetail($feedbackMessage, $message);
        } else {
            $this->saveFeedbackMessage($message, $clientEmail);
        }
    }

    /**
     * @param $feedbackMessage
     * @param $message
     */
    private function saveFeedbackDetail($feedbackMessage, $message)
    {
        $feedbackDetail = new FeedbackDetail();
        $feedbackDetail->setFeedbackMessage($feedbackMessage)
            ->setMessage($message)
            ->setAuthor(FeedbackDetail::CLIENT);

        $feedbackMessage->setStatus(FeedbackMessage::NOT_VIEWED);
        $this->entityManager->persist($feedbackMessage);
        $this->entityManager->persist($feedbackDetail);
        $this->entityManager->flush();
    }

    /**
     * @param $message
     * @param $clientEmail
     */
    private function saveFeedbackMessage($message, $clientEmail)
    {
        $feedbackMessageNew = new FeedbackMessage();
        $feedbackMessageNew->setMessage($message)
            ->setEmail($clientEmail)
            ->setFirstname('Client')
            ->setLastname('Unregistered');

        $this->entityManager->persist($feedbackMessageNew);
        $this->entityManager->flush();
    }

    /**
     * @param $string
     * @return string
     */
    private function outlook($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/\b[^\s]+@[^\s]+/', $line)) {
                break;
            }
            $message[] = $line;
        }

        return mb_convert_encoding(implode(PHP_EOL, $message), 'UTF-8', 'koi8-u');
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHtmlOnline($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->substituteEntities = true;
        $dom->encoding = 'UTF-8';
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $dom->encoding = 'UTF-8';
        $dom->saveXML();
        $spans = $dom->getElementsByTagName('span');
        $ps = $dom->getElementsByTagName('p');
        $message = '';
        foreach ($spans as $span) {
            $message .= $span->textContent;
        }
        foreach ($ps as $p) {
            $message .= $p->textContent;
        }

        return $this->onlyText($message);
    }

    /**
     * @param $string
     * @return string
     */
    private function metaUa($string): string
    {
        $lines = preg_split('/\n|\r\n?/', $string);
        $message = [];
        foreach ($lines as $line) {
            if (preg_match('/i$/', $line)) {
                break;
            }
            $message[] = $line;
        }

        return mb_convert_encoding(implode(PHP_EOL, $message), 'UTF-8', 'windows-1251');
    }

    /**
     * @param $html
     * @return string
     */
    private function parseHtmlYandex($html): string
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $divs = $dom->getElementsByTagName('div');
        $message = $divs[0]->textContent;

        return $this->onlyText($message);
    }
}