<?php

namespace App\Controller;

use App\Entity\DiagramFile;
use App\Repository\DiagramFileRepository;
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


#[IsGranted('ROLE_USER')]
#[Route('/api', name: 'api_')]
class FilesController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $entityManager, private DiagramFileRepository $diagramFileRepository,
    private  LoggerInterface $logger)
    {
    }

    #[Route('/files', name: 'app_files', methods: ['GET'])]
    public function index(DiagramFileRepository $diagramFileRepository): JsonResponse
    {

        $files = $diagramFileRepository->findBy(['owner' => $this->getUser()]);

        $response = [];
        foreach ($files as $file) {
            $response[] = [
                'id' => $file->getId(),
                'name' => $file->getName(),
                'path' => $file->getPath(),
                'owner' => $file->getOwner()->getId(),
                'createdAt' => $file->getCreatedAt()?->getTimestamp(),
                'updatedAt' => $file->getUpdatedAt()?->getTimestamp(),
            ];
        }

        return $this->json($response);
    }

    #[Route('/files/remove/{id}', name: 'app_files_remove', methods: ["DELETE"])]
    public function remove(int $id): JsonResponse
    {
        $file = $this->diagramFileRepository->findOneBy(['owner'=>$this->getUser(),'id'=>$id]);

        $filesystem = new Filesystem();

        $filePath= $this->getParameter('public_directory').$file->getPath();

        $filesystem->remove($filePath);

        if(!$filesystem->exists($filePath)){
            $this->entityManager->remove($file);
            $this->entityManager->flush();
        }


        return $this->json(['message'=>'File removed!']);
    }


    #[Route('/files/save', name: 'app_files_new', methods: ["POST"])]
    public function save(Request $request,): JsonResponse
    {

        if ($request->query->get('id')) {

            $file = $this->diagramFileRepository->findOneBy(['owner'=>$this->getUser(),'id'=>$request->query->get('id')]);

            $file->setUpdatedAt(new \DateTimeImmutable());
            $this->writeData($file->getPath(),$request);

        }else if ($request->query->get('name')){
            $file = $this->saveNew($request);
        }else{
            throw $this->createNotFoundException();
        }

        return $this->json([
            'id' => $file->getId(),
            'name' => $file->getName(),
            'path' => $file->getPath(),
            'owner' => $file->getOwner()->getId(),
            'createdAt' => $file->getCreatedAt()?->getTimestamp(),
            'updatedAt' => $file->getUpdatedAt()?->getTimestamp(),
        ]);
    }


    private function saveNew(Request $request): DiagramFile
    {
        $filePath =  sprintf("/uploads/%s/%s.json", $this->getUser()?->getStorage(),Uuid::v4());

        $timestamp = new \DateTimeImmutable();
        $file = new DiagramFile();
        $file->setOwner($this->getUser());
        $file->setCreatedAt($timestamp);
        $file->setName($request->query->get('name'));
        $file->setPath($filePath);

        if (! $this->writeData($filePath,$request)){
            throw new \Exception("Could not save file");
        }

        $this->entityManager->persist($file);
        $this->entityManager->flush();

        return $this->diagramFileRepository->findOneBy(['owner' => $this->getUser(), 'createdAt' => $timestamp]);
    }

    private function writeData(string $filePath, Request $request): bool
    {
        try {
            $filesystem = new Filesystem();

            $userDirectory = $this->getParameter('public_directory')."/uploads/".$this->getUser()?->getStorage();

            if (!$filesystem->exists($userDirectory)){
                $filesystem->mkdir($userDirectory, 0700);
            }


            file_put_contents(
                sprintf('%s/%s',
                    $this->getParameter('public_directory'),
                    $filePath
                ),
                $request->getContent()
            );

            return true;
        }catch (\Throwable $exception){
            $this->logger->error('An error occurred while writing data.',[
                'message'=>$exception->getMessage(),
                'file'=>$exception->getFile(),
                'code'=>$exception->getCode(),
                'data'=>$filePath,
            ]);

            return false;
        }


    }
}