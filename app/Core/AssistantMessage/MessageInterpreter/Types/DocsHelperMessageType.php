<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\dd;
use App\Services\KnowledgeService;

class DocsHelperMessageType extends AbstractInterpreterMessageType
{
    public function __construct(
        private readonly LanguageModel $languageModel,
        private readonly KnowledgeService $knowledgeService
    ){}

    protected ?string $type = 'complaints';
    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $resultKnowledgeBase = $this->knowledgeService->getInformationFromDocumentations($messageProcessor->getMessageFromUser());

        $result = new InterpretationDetails();
        $result->setExecuteEvent(false);
        $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());
        $result->setResultResponseSystemPrompt('Jesteś SeniorPHPDeveloperem w projekcie WiseB2B. Na podstawie poniższych informacji z dokumentacji odpowiedź klientowi na jego pytanie. ### Informacje z dokumentacji: ### '. $resultKnowledgeBase);


        return $result;
    }
}
