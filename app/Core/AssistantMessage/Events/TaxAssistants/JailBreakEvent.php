<?php

namespace App\Core\AssistantMessage\Events\TaxAssistants;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;

class JailBreakEvent extends Event
{
    protected ?string $name = 'jail_break';
    protected ?string $description = 'Gdy rozmowa nie jest prowadzona na temat podatków i sprawozdań finansowych';

    public function handle(MessageProcessor $messageProcessor): EventResult
    {
        $result = new EventResult();
        $result
            ->setResultResponseSystemPrompt('Odpowiedz, że twoim zadaniem jest pomoc w sprawach jakie można załatwić w ministerwie finansów ')
            ->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        $messageProcessor->getLoggerStep()->addStep([
            'executeEvent' => true,
            'event' => self::class,
            'messageFromUser' => $messageProcessor->getMessageFromUser(),
        ], 'FindProductEvent');

        return $result;
    }
}
