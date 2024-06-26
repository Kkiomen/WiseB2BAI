<?php

namespace App\Http\Controllers;

use App\Core\AssistantMessage\Service\SessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function __construct(
        private readonly SessionService $sessionService
    ){}

    public function generateSession(Request $request): JsonResponse
    {
        return response()->json([
            'session_hash' => $this->sessionService->generateSession()
        ]);
    }
}
