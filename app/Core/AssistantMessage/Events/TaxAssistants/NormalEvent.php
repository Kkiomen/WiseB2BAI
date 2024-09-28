<?php

namespace App\Core\AssistantMessage\Events\TaxAssistants;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;

class NormalEvent extends Event
{
    protected ?string $name = 'normal';
    protected ?string $description = 'normalna rozmowa';

    public function handle(MessageProcessor $messageProcessor): EventResult
    {
        $result = new EventResult();
        $result
            ->setResultResponseSystemPrompt($messageProcessor->getSystemPrompt())
            ->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        $messageProcessor->getLoggerStep()->addStep([
            'executeEvent' => true,
            'event' => self::class,
            'messageFromUser' => $messageProcessor->getMessageFromUser(),
        ], self::class);

        return $result;
    }
}
