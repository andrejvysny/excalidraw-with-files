<?php

namespace App\Controller;

use App\Entity\DiagramFile;
use App\Entity\Library;
use App\Repository\DiagramFileRepository;
use App\Repository\LibraryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpClient\Exception\ServerException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;


#[Route('/api/library', name: 'api_')]
class LibraryController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $entityManager, private LibraryRepository $libraryRepository,
    private  LoggerInterface $logger)
    {
    }


    #[Route('/load', name: 'app_library_load', methods: ["GET"])]
    public function get(): JsonResponse
    {

        $libs = $this->libraryRepository->findBy(['global'=>true]);
        $libsArr = [];
        foreach ($libs as $lib){
            $libsArr[] = [
                'id' => $lib->getId(),
                'name' => $lib->getName(),
                'path' => $lib->getPath(),
                'createdAt' => $lib->getCreatedAt()?->getTimestamp(),
                'data'=> $this->getLibraryData($lib),
            ];
        }

        return $this->json([
            'data'=>$libsArr,
        ]);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/upload', name: 'app_library_upload_new', methods: ["POST"])]
    public function upload(Request $request,): JsonResponse
    {
        $lib = $this->saveNew($request);

        return $this->json([
            'id' => $lib->getId(),
            'name' => $lib->getName(),
            'path' => $lib->getPath(),
            'createdAt' => $lib->getCreatedAt()?->getTimestamp(),
        ]);
    }


    private function saveNew(Request $request): Library
    {
        $filePath =  sprintf("/uploads/libs/%s.json",Uuid::v4());

        $timestamp = new \DateTimeImmutable();
        $library = new Library();
        $library->setCreatedAt($timestamp);
        $library->setGlobal(true);
        $library->setName($request->query->get('name'));
        $library->setPath($filePath);

        if (! $this->writeData($filePath,$request)){
          //  throw new \Exception("Could not save file");
        }

        $this->entityManager->persist($library);
        $this->entityManager->flush();

        return $this->libraryRepository->findOneBy(['path' => $library->getPath(), 'createdAt' => $timestamp]);
    }

    private function writeData(string $filePath, Request $request): bool
    {
        try {
            $filesystem = new Filesystem();

            $libDirectory = $this->getParameter('public_directory')."/uploads/libs";

            if (!$filesystem->exists($libDirectory)){
                $filesystem->mkdir($libDirectory, 0700);
            }

            file_put_contents(
                sprintf('%s%s',
                    $this->getParameter('public_directory'),
                    $filePath
                ),
                $request->getContent()
            );
            return true;
        }catch (\Throwable $exception){
            throw $exception;
            $this->logger->error('An error occurred while writing data.',[
                'message'=>$exception->getMessage(),
                'file'=>$exception->getFile(),
                'code'=>$exception->getCode(),
                'data'=>$filePath,
            ]);
            return false;
        }
    }

    private function getLibraryData(Library $lib): array
    {
        $data = file_get_contents(sprintf('%s/%s',
            $this->getParameter('public_directory'),
            $lib->getPath()
        ));
        return json_decode($data,true);
    }
}