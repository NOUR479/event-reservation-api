<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;


final class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'app_register',methods:['POST'])]
    #[IsGranted('ROLE_USER')]
    public function register(Request $request,EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
       $data = json_decode($request->getContent(), true);

    $user = new User();
    $user->setEmail($data['email']);

    $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);

    $user->setRoles(['ROLE_USER']);

    $em->persist($user);
    $em->flush();

    return $this->json([
        'message' => 'User created successfully'
    ]);
    }
}
