<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\EventsList;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Interfaces\MessageInterpreterInterface;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\Dto\InterpreterMessageTypesResponseDto;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\InterpreterMessageTypeLists;
use App\Core\AssistantMessage\Prompts\ChooseEventPromptHelper;
use App\Core\dd;

class MessageInterpreter implements MessageInterpreterInterface
{
    private array $eventListClasses = [];

    public function __construct(
        private readonly EventsList                  $eventsList,
        private readonly InterpreterMessageTypeLists $interpreterMessageTypeLists,
        private readonly LanguageModel               $languageModel,
    ){}

    /**
     * Has the task of interpreting and analyzing messages from users. It decides on further actions
     * @param MessageProcessor $messageProcessor
     * @return InterpretationDetails
     */
    public function interpretMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();

        // Interpret the message by type
        $messageTypeInterpreterResponse = $this->interpretMessageByType($messageProcessor);
        if(!$messageTypeInterpreterResponse->isExecuteEvent()){
            return $messageTypeInterpreterResponse;
        }


        // Check if any triggers are used in the content.
        // Triggers allow for better control over the handling of the process that will be followed to display the final message to the end user
        if (!$this->usedTriggerInContent(content: $messageProcessor->getMessageFromUser(), type: $messageProcessor->getType())) {
            $messageProcessor->getLoggerStep()->addStep([
                'type' => $result->getType(),
                'message' => 'No event has triggers to handle this message',
            ], 'MessageInterpreter');

            return $result;
        }

        // Choose an event based on the content - by LLM
        $eventChosen = $this->chooseEvent($messageProcessor->getMessageFromUser());

        foreach ($this->eventListClasses as $eventClass) {
            $eventClass = app($eventClass);
            if (!$eventClass instanceof Event) {
                continue;
            }

            // Check if the event is in the list of events
            if ($eventClass->getName() == $eventChosen) {
                $result
                    ->setType($eventChosen)
                    ->setInterpretedClass($eventClass);


                $messageProcessor->getLoggerStep()->addStep([
                    'type' => $result->getType(),
                    'message' => 'Event chosen',
                    'eventChosen' => $eventChosen,
                    'interpretedClass' => $eventClass::class
                ], 'MessageInterpreter');

                return $result;
            }
        }


        // If the event is not in the list of events, return the default event
        $messageProcessor->getLoggerStep()->addStep([
            'type' => $result->getType(),
            'message' => 'Not found event',
            'eventChosen' => $eventChosen ?? null,
            'executeEvent' => $result->isExecuteEvent(),
            'interpreterType' => $result->getInterpreterType() ?? null
        ], 'MessageInterpreter');

        return $result;
    }

    /**
     * Choose an event based on the content.
     *
     * @param string $content The content string
     * @return string The name of the chosen event
     */
    private function chooseEvent(string $content): string
    {
        return $this->languageModel->generate(
            prompt: $content,
            systemPrompt: ChooseEventPromptHelper::getPrompt($this->getListsEventToChoose(true)),
            settings: (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::INTELLIGENT)->setTemperature(0.3)
        );
    }

    /**
     * Get a list of events to choose from.
     *
     * @param bool $toString If true, return as a string, otherwise as an array
     * @return array|string A list of events or a string representation
     */
    private function getListsEventToChoose(bool $toString = false): array|string
    {
        $resultArray = [];
        $resultString = '';

        foreach ($this->eventListClasses as $eventClass) {
            $eventClass = app($eventClass);
            if(!$eventClass instanceof Event){
                continue;
            }

            $resultArray[$eventClass->getName()] = $eventClass->getDescription();
            $resultString .= $eventClass->getName() . ' - ' . $eventClass->getDescription() . '| ';
        }

        if ($toString) {
            return $resultString;
        }

        return $resultArray;
    }

    /**
     * Check if any triggers are used in the content.
     *
     * @param string $content The content string
     * @return bool True if any triggers are used, otherwise false
     */
    private function usedTriggerInContent(string $content, ?string $type): bool
    {
        $result = false;
        $listOfEventsHandledByTriggers = [];

        // Check if has events with current $type
        if(!empty($type) && !empty($this->prepareEventsList()[$type])){
            $listClasses = $this->prepareEventsList()[$type];
            $this->eventListClasses = $listClasses['events'];

            // If the event does not use triggers, return true
            if($listClasses['useTriggers'] === false){
                return true;
            }


        }else{
            return $result;
        }

        foreach ($this->eventListClasses as $eventClass) {
            foreach ($eventClass->getTriggers() as $trigger) {
                if (str_contains(strtolower($content), strtolower($trigger))) {
                    $result = true;
                    $listOfEventsHandledByTriggers[] = $eventClass;
                }
            }
        }

        $this->eventListClasses = $listOfEventsHandledByTriggers;
        return $result;
    }

    /**
     * Prepare events list
     */
    private function prepareEventsList(): array
    {
        return $this->eventsList->getList();
    }


    /**
     * Prepare interpreter class type
     */
    private function prepareInterpreterClassTypes(?string $type): ?AbstractInterpreterMessageType
    {
        $interpreter = null;

        foreach ($this->interpreterMessageTypeLists->getList() as $typeInterpreter) {
            $interpreterObject = app($typeInterpreter);
            if ($interpreterObject instanceof AbstractInterpreterMessageType) {

                if ($interpreterObject->getType() === $type) {
                    $interpreter = $interpreterObject;
                    break;
                }
            }
        }

        return $interpreter;
    }

    private function interpretMessageByType(MessageProcessor $messageProcessor): InterpretationDetails
    {
        if ($messageProcessor->getType() === null) {
            return new InterpretationDetails();
        }

        $typeInterpreterObject = $this->prepareInterpreterClassTypes($messageProcessor->getType());
        if ($typeInterpreterObject !== null) {
            return $typeInterpreterObject->interpreterMessageByType($messageProcessor);
        }


        return new InterpretationDetails();
    }
}
