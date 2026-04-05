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
   #[IsGranted('ROLE_ADMIN')]
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
    #[IsGranted('ROLE_USER')]
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


    // Update event (Admin only)
    #[Route('/api/events/{id}', name:'update_event', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update($id, Request $request, EventRepository $repo, EntityManagerInterface $em)
    {
        $event = $repo->find($id);
        if (!$event) {
            return $this->json(['error' => 'Event not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $event->setName($data['name'] ?? $event->getName());
        $event->setDescription($data['description'] ?? $event->getDescription());
        if (!empty($data['date'])) $event->setDate(new \DateTime($data['date']));
        $event->setLocation($data['location'] ?? $event->getLocation());

        $em->flush();

        return $this->json(['message' => 'Event updated']);
    }

    // Delete event (Admin only)
    #[Route('/api/events/{id}', name:'delete_event', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete($id, EventRepository $repo, EntityManagerInterface $em)
    {
        $event = $repo->find($id);
        if (!$event) {
            return $this->json(['error' => 'Event not found'], 404);
        }

        $em->remove($event);
        $em->flush();

        return $this->json(['message' => 'Event deleted']);
    }
}
