<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\PrepareHelperForCreateEndpointHelper;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Services\KnowledgeService;

class HelperEndpointCreateType extends AbstractInterpreterMessageType
{
    public function __construct(
        private readonly LanguageModel $languageModel,
        private readonly KnowledgeService $knowledgeService,
        private readonly PrepareHelperForCreateEndpointHelper $prepareHelperForCreateEndpointHelper
    ){}

    protected ?string $type = 'help-create-endpoint';
    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();
        $result->setExecuteEvent(false);
        $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());
        $result->setResultResponseSystemPrompt($this->prepareHelperForCreateEndpointHelper->prepareFullPromptSystem($messageProcessor->getMessageFromUser()));


        return $result;
    }
}
