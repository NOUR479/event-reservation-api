<?php

namespace App\Controller;

use App\Repository\EventRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Event;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class EventController extends AbstractController
{
   #[Route('/api/events', methods: ['POST'])]
   #[IsGranted('ROLE_USER')]
    public function create(Request $request, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);

        $event = new Event();
        $event->setName($data['name']);
        $event->setDescription($data['description']);
        $event->setDate(new \DateTime($data['date']));
        $event->setLocation($data['location']);

        $em->persist($event);
        $em->flush();

        return $this->json(['message' => 'Event created']);
    }

    #[Route('/api/events', methods: ['GET'])]
    public function list(EventRepository $repo)
    {
         $events = $repo->findAll();

        $data = [];

        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i'),
                'location' => $event->getLocation(),
            ];
        }

        return $this->json($data);
    }

}
