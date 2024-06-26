<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Types\Abstract;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;

abstract class AbstractInterpreterMessageType
{
    protected ?string $type = null;

    public function interpreterMessageByType(MessageProcessor $messageProcessor): InterpretationDetails
    {
        return $this->interpreterMessage($messageProcessor);
    }

    protected abstract function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails;

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
