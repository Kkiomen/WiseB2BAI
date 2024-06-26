<?php

namespace App\Core\AssistantMessage\Facade\Interfaces;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

interface MessageFacadeInterface
{
    public function processAndReturnResponse(): JsonResponse|StreamedResponse;
    public function loadRequest(Request $request): void;
}
