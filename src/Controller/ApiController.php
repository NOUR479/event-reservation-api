<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\User;

class ApiController extends AbstractController
{
    #[Route('/api/test', name: 'api_test')]
    #[IsGranted('ROLE_USER')]
    public function test(): JsonResponse
    {
        /** @var User $user */
        $user=$this->getUser();

        return $this->json([
            'message' => 'JWT fonctionne ',
            'user' => $user->getEmail(),
        ]);
    }
}