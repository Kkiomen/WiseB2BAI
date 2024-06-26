<?php

namespace App\Core\AssistantMessage\MessageInterpreter\Interfaces;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;

interface MessageInterpreterInterface
{
    public function interpretMessage(MessageProcessor $messageProcessor): InterpretationDetails;
}
