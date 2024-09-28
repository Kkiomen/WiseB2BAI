<?php

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\AssistantMessage\Prompts\TaxAssistantPromptHelper;
use App\Models\ConversationDeclarationTemporaryData;

class TaxAssistantMessageType extends AbstractInterpreterMessageType
{
    protected ?string $type = 'tax_assistant';
    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();
        $result->setExecuteEvent(true);
        $result->setResultResponseSystemPrompt(TaxAssistantPromptHelper::getBasicAssistantPrompt());

        $declarationTemporary = $messageProcessor?->getMessage()?->conversation?->declarationTemporaryData;
        if(!$declarationTemporary instanceof ConversationDeclarationTemporaryData){
            $messageProcessor->getLoggerStep()->addStep([
                'interpreter' => self::class,
                'messageFromUser' => $messageProcessor->getMessageFromUser(),
            ], '$declarationTemporary instanceof ConversationDeclarationTemporaryData');


            $result->setExecuteEvent(false);
            $result->setResultResponseUserMessage('Wyjaśnij, że wystąpił błąd i prosimy aby użytkownik odświeżył stronę');
            return $result;
        }

        if($declarationTemporary->explain_situation === false && $declarationTemporary->required_fields == null){
            $result->setResultResponseUserMessage('Przywitaj się i poinformuj, że chesz pomóc wypełnić wniosek PCC-3. Poproś o wyjaśnienie całej sytuacji abyśmy mogli pomóc uzupełnić odpowiednie pola we wniosku, bądź może użytkownik ma jakieś pytania..');

            $messageProcessor->setSystemPrompt(TaxAssistantPromptHelper::getBasicAssistantPrompt());
            $messageProcessor->getLoggerStep()->addStep([
                'interpreter' => self::class,
                'messageFromUser' => $messageProcessor->getMessageFromUser(),
            ], '$declarationTemporary->explain_situation === false && $declarationTemporary->required_fields == null');

            return $result;
        }

        $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        return $result;
    }
}
