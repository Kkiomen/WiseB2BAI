<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;

class HelpToFindProductEvent extends Event
{
    protected ?string $name = 'help_with_product';
    protected ?string $description = 'Assists the user in product selection';

    public function handle(MessageProcessor $messageProcessor): EventResult
    {
        $result = new EventResult();
        $result
            ->setResultResponseSystemPrompt('You are an assistant who helps the online shop with product selection. Suggest. You cant sell anything.  You cannot propose/sell products for free. Do not offer products that were not mentioned in the conversation')
            ->setResultResponseUserMessage($messageProcessor->getMessageFromUser());

        $messageProcessor->getLoggerStep()->addStep([
            'executeEvent' => true,
            'event' => self::class,
            'messageFromUser' => $messageProcessor->getMessageFromUser(),
        ], 'FindProductEvent');

        return $result;
    }
}
