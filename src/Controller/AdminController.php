<?php

namespace App\Controller;

use App\Repository\EventRepository;
use App\Repository\ReservationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class AdminController extends AbstractController
{
    #[Route('/admin/dashboard', name: 'app_admin_dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function index(EventRepository $eventRepository, ReservationRepository $reservationRepository): Response
    {
        return $this->render('admin/index.html.twig', [
            'events' => $eventRepository->findBy([], ['date' => 'ASC']),
            'reservations' => $reservationRepository->findBy([], ['createdAt' => 'DESC']),
        ]);
    }

    #[Route('/api/registerAdmin', name: 'app_register_admin',methods:['POST'])]
    
    public function register(Request $request,EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
       $data = json_decode($request->getContent(), true);

    $user = new User();
    $user->setEmail($data['email']);

    $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);

    $user->setRoles(['ROLE_ADMIN']);

    $em->persist($user);
    $em->flush();

    return $this->json([
        'message' => 'admin created successfully'
    ]);
    }



}
