<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

class UserController extends AbstractController
{
        public function __construct(
        private readonly EntityManagerInterface               $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    #[Route("/api/register")]
    public function register(Request $request): JsonResponse
    {

        $content = json_decode($request->getContent(), true);

        if (empty($content['email']) || empty($content['password'])) {
            throw new \LogicException(
                'Missing one of parameters: email, password',
                Response::HTTP_NOT_ACCEPTABLE
            );
        }

        if ($this->em->getRepository(User::class)->findBy(['email' => $content['email']])) {
            throw new \LogicException('Email already registered!', Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($content['email']);
        $user->setStorage(Uuid::v4());
        $user->setPassword($this->passwordHasher->hashPassword($user, $content['password']));


        $this->em->persist($user);
        $this->em->flush();

        $filesystem = new Filesystem();

        $userDirectory = $this->getParameter('public_directory')."/uploads/".$user->getStorage();

        if (!$filesystem->exists($userDirectory)){
            $filesystem->mkdir($userDirectory, 0700);
        }

        return new JsonResponse(["message"=>"User successfully registered!"], Response::HTTP_CREATED);
    }
}
