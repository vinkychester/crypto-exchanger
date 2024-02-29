<?php

namespace App\Service\Media;


/**
 * Class FileUploaderService
 * @package App\Service\Media
 */
class FileUploaderService
{
    private string $targetDirectory;

    /**
     * @param \Symfony\Component\HttpFoundation\File\UploadedFile $file
     * @return string
     */
    public function upload(\Symfony\Component\HttpFoundation\File\UploadedFile $file): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = md5(uniqid('', true)) . '.' . $file->guessExtension();

        try {
            $file->move($this->getTargetDirectory(), $fileName);
        } catch (\Symfony\Component\HttpFoundation\File\Exception\FileException $e) {
            // ... handle exception if something happens during file upload
        }

        return $fileName;
    }

    /**
     * @return string
     */
    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }

    /**
     * @param string $targetDirectory
     */
    public function setTargetDirectory(string $targetDirectory): void
    {
        $this->targetDirectory = $targetDirectory;
    }
}