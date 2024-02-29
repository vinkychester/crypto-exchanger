<?php


namespace App\Resolver\Mutation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;

/**
 * Class CreditCardMutationResolver
 * @package App\Resolver\Mutation
 */
class CreditCardMutationResolver implements MutationResolverInterface
{
    private \App\Utils\Base64FileExtractor $extractor;
    private \App\Utils\FileSingleton $fileSingleton;
    private \App\Service\Media\FileUploaderService $uploaderService;
    private \Symfony\Component\Filesystem\Filesystem $filesystem;
    private string $creditDir;

    /**
     * CreditCardMutationResolver constructor.
     * @param \App\Utils\Base64FileExtractor $extractor
     * @param \App\Utils\FileSingleton $fileSingleton
     * @param \App\Service\Media\FileUploaderService $uploaderService
     * @param \Symfony\Component\Filesystem\Filesystem $filesystem
     * @param string $creditDir
     */
    public function __construct(
        \App\Utils\Base64FileExtractor $extractor,
        \App\Utils\FileSingleton $fileSingleton,
        \App\Service\Media\FileUploaderService $uploaderService,
        \Symfony\Component\Filesystem\Filesystem $filesystem,
        string $creditDir
    ) {
        $this->fileSingleton = $fileSingleton;
        $this->uploaderService = $uploaderService;
        $this->filesystem = $filesystem;
        $this->creditDir = $creditDir;
        $this->extractor = $extractor;
    }

    /**
     * @throws \Exception
     */
    public function __invoke($item, array $context): ?object
    {
        $uploadedFiles = $item->getFiles();
        $base64FileExtractor = $this->extractor;
        $path = $this->fileSingleton->generateRandomPath(3);
        $directory = $this->fileSingleton->createDirectory($this->filesystem, $this->creditDir . $path);
        $this->uploaderService->setTargetDirectory($directory);
        $fileUploader = $this->uploaderService;
        array_walk($uploadedFiles, static function ($value) use ($item, $base64FileExtractor, $fileUploader, $path) {
            $mediaObject = new \App\Entity\MediaObject();
            $base64Image = $value['data_url'];
            $base64Image = $base64FileExtractor->extractBase64String($base64Image);
            $imageFile = new \App\Service\Media\UploadedBase64FileService($base64Image);
            $mediaObject->setStorage($path)
                ->setType(\App\Entity\MediaObject::CREDIT_TYPE)
                ->setContentUrl($fileUploader->upload($imageFile));
            $item->addMediaObject($mediaObject);
        });

        return $item;
    }
}