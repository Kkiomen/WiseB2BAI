<?php

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\AssistantMessage\Prompts\TaxAssistantPromptHelper;

class TaxAssistantMessageType extends AbstractInterpreterMessageType
{
    protected ?string $type = 'tax_assistant';
    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();
        $result->setExecuteEvent(false);
        $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());
        $result->setResultResponseSystemPrompt(TaxAssistantPromptHelper::getBasicAssistantPrompt());
        $result->setResultResponseSystemPrompt('Jesteś asystentem Ministerstwa Finansów, twoim celem jest pomóc w wypełnieniu deklaracji podatkowych');

        return $result;
    }
}
