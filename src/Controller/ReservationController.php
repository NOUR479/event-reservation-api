<?php

namespace App\Controller;


use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EventRepository;
use App\Entity\Reservation;
use Symfony\Component\Validator\Constraints\DateTime;
use App\Repository\ReservationRepository;
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
        EventRepository $eventRepo,
        MailerInterface $mailer
    ) {
        $data = json_decode($request->getContent(), true);

        $reservation = new Reservation();
        $reservation->setCreatedAt(new \DateTimeImmutable()); 

        $event = $eventRepo->find($data['event_id']);
        if (!$event) {
            return $this->json(['error' => 'Event not found'], 404);
        }
        $reservation->setEvent($event);

        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $reservation->setUser($user);

        $em->persist($reservation);
        $em->flush();

        $email = (new Email())
        ->from('noreply@test.com')
        ->to($user->getUserIdentifier())
        ->subject('Reservation Confirmed')
        ->text('You reserved: ' . $event->getName());

    $mailer->send($email);

    return $this->json(['message' => 'Reservation created + email sent']);
    }


    #[Route('/api/reservations/my', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function myReservations(ReservationRepository $repo)
    {
        $user = $this->getUser();
        $reservations = $repo->findBy(['user' => $user]);

        $data = [];
        foreach ($reservations as $res) {
            $data[] = [
                'id' => $res->getId(),
                'event' => $res->getEvent()->getName(),
                'date_reserved' => $res->getCreatedAt()->format('Y-m-d H:i')
            ];
        }

        return $this->json($data);
    }

    // Delete my reservation (User only)
    #[Route('/api/reservations/my/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function deleteMyReservation($id, ReservationRepository $repo, EntityManagerInterface $em)
    {
        $reservation = $repo->find($id);
        if (!$reservation) return $this->json(['error' => 'Reservation not found'], 404);

        // Check ownership
        if ($reservation->getUser() !== $this->getUser() && !in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($reservation);
        $em->flush();

        return $this->json(['message' => 'Reservation deleted']);
    }
    //admin can see all reservations + user ID
    #[Route('/api/reservations', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function allReservations(ReservationRepository $repo)
    {        $reservations = $repo->findAll();  

        $data = [];
        foreach ($reservations as $res) {
            $data[] = [
                'id' => $res->getId(),
                'event' => $res->getEvent()->getName(),
                'user_id' => $res->getUser()->getId(),
                'date_reserved' => $res->getCreatedAt()->format('Y-m-d H:i')
            ];
        }

        return $this->json($data);
    }

}
