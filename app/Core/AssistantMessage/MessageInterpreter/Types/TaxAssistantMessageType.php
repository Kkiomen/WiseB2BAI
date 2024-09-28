<?php

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Enums\DirectionOfConversationEnum;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\AssistantMessage\Prompts\TaxAssistantPromptHelper;
use App\Models\ConversationDeclarationTemporaryData;

class TaxAssistantMessageType extends AbstractInterpreterMessageType
{
    protected ?string $type = 'tax_assistant';

    public function __construct(
        private readonly LanguageModel $languageModel
    )
    {
    }

    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();
        $result->setMessageProcessor($messageProcessor);
        $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        // Verify context conversation
        $this->checkContext($messageProcessor, $result);

        if(empty($result->getResultResponseSystemPrompt(true))){
            $result->setResultResponseSystemPrompt(TaxAssistantPromptHelper::getBasicAssistantPrompt());
        }

        return $result;
    }

    protected function checkContext(MessageProcessor $messageProcessor, InterpretationDetails $result): void
    {
        $declarationTemporary = $messageProcessor?->getMessage()?->conversation?->declarationTemporaryData;

        if ($declarationTemporary && $declarationTemporary instanceof ConversationDeclarationTemporaryData) {

            // First conversation message
            if (
                $declarationTemporary->explain_situation === false &&
                $declarationTemporary->required_fields == null &&
                $declarationTemporary->direction_of_conversation === null
            ) {
                // Starting Message
                if ($messageProcessor?->getConversationMessages()->isEmpty()) {
                    $result->setResultResponseSystemPrompt(TaxAssistantPromptHelper::getStartingPrompt());
                    $result->setResultResponseUserMessage($messageProcessor->getMessageFromUser());
                    return;
                }

                // Check context conversation
                if (empty($result->getResultResponseSystemPrompt(true))) {
                    $maxError = 3;
                    $error = 0;
                    $success = false;
                    $resultVerifiedContext = null;
                    do {

                        try {
                            $verifiedContext = $this->languageModel->generate(
                                prompt: $messageProcessor->getMessageFromUser(),
                                systemPrompt: TaxAssistantPromptHelper::verifyContext(),
                                settings: (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::NORMAL)->setTemperature(1)
                            );

                            $resultVerifiedContext = DirectionOfConversationEnum::from($verifiedContext);

                            $success++;
                        } catch (\Exception $exception) {
                            $error++;
                        }
                    } while ($error < $maxError && $success === false);

                    // Save information about context conversation
                    if ($resultVerifiedContext !== null) {
                        $declarationTemporary->direction_of_conversation = $resultVerifiedContext->value;
                        $declarationTemporary->save();

                        $messageProcessor->getMessage()->conversation->declarationTemporaryData = $declarationTemporary;
                    }
                }
            }
        }else{
            // Logging
            $messageProcessor->getLoggerStep()->addStep([
                'interpreter' => self::class,
                'messageFromUser' => $messageProcessor->getMessageFromUser(),
            ], '$declarationTemporary instanceof ConversationDeclarationTemporaryData');


            $result->setExecuteEvent(false);
            $result->setResultResponseUserMessage('Wyjaśnij, że wystąpił błąd i prosimy aby użytkownik odświeżył stronę');
            return;
        }

        $result->setExecuteEvent(true);
    }
}
