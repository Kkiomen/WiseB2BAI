<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events\Core;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;

class EventExecutor
{
    public function __construct(
    ){}

    public function executeEvent(InterpretationDetails $interpretationDetails, MessageProcessor $messageProcessor): EventResult
    {
        if($interpretationDetails->getInterpretedClass() !== null){
            $messageProcessor->getLoggerStep()->addStep([
                'interpretedClass' => $interpretationDetails->getInterpretedClass()::class
            ], 'EventExecutor - obsługa przez event');
            return $interpretationDetails->getInterpretedClass()->handle($messageProcessor);
        }

        $messageProcessor->getLoggerStep()->addStep([
            'interpretedClass' => null
        ], 'EventExecutor - normalna wiadomość');

        $result = new EventResult();
        $result->setMessageProcessor($messageProcessor);
        $result->setHandleWithEvent(false);

        return $result;
    }
}
