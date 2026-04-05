<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EventRepository;
use App\Entity\Reservation;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class ReservationController extends AbstractController
{
        #[Route('/api/reservations', methods: ['POST'])]
        #[IsGranted('ROLE_USER')]
    public function reserve(
        Request $request,
        EntityManagerInterface $em,
        EventRepository $eventRepo
    ) {
        $data = json_decode($request->getContent(), true);

        $reservation = new Reservation();
        $reservation->setCreatedAt(new \DateTimeImmutable()); 

        $event = $eventRepo->find($data['event_id']);
        $reservation->setEvent($event);

        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $reservation->setUser($user);

        $em->persist($reservation);
        $em->flush();

        return $this->json(['message' => 'Reservation created']);
    }
}
