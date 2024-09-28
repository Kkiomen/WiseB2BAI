<?php

namespace App\Core\AssistantMessage\Events\TaxAssistants;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;
use App\Core\AssistantMessage\Prompts\TaxAssistantPromptHelper;
use App\Services\KnowledgeService;

class AskQuestionEvent extends Event
{
    protected ?string $name = 'question';
    protected ?string $description = 'Gdy użytkownik potrzebuje odpowiedzi na pytanie nie związane z UZUPEŁNIENIEM deklaracji finansowej ale dalej skierowane pytanie jest do ministerstwa finansów';

    public function __construct(
        private readonly KnowledgeService $knowledgeService
    ){}

    public function handle(MessageProcessor $messageProcessor): EventResult
    {
        $resultKnowledgeBase = $this->knowledgeService->getInformationFromDocumentations($messageProcessor->getMessageFromUser());
        $resultSystemPrompt =  'Odpowiedź użytkownikowi na podstawie bazy wiedzy. ###' . TaxAssistantPromptHelper::getWarningAssistantPrompt() .
            '### Baza wiedzy:' . $resultKnowledgeBase;


        $result = new EventResult();
        $result
            ->setResultResponseSystemPrompt(
                $resultSystemPrompt
            )
            ->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        $messageProcessor->getLoggerStep()->addStep([
            'executeEvent' => true,
            'event' => self::class,
            'messageFromUser' => $messageProcessor->getMessageFromUser(),
            'resultKnowledgeBase' => $resultKnowledgeBase,
        ], 'AskQuestionEvent');

        return $result;

    }
}
