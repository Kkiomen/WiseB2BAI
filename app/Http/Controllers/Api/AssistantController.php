<?php

namespace App\Http\Controllers\Api;

use App\Core\AssistantMessage\Facade\MessageFacade;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AssistantController extends Controller
{
    public function __construct(
        private readonly MessageFacade $messageFacade
    ){}

    public function message(Request $request)
    {
        $this->messageFacade->loadRequest($request);
        return $this->messageFacade->processAndReturnResponse();
    }
}
