<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\Dto;

class InterpreterMessageTypesResponseDto
{
    private bool $executeEvent = false;

    public function isExecuteEvent(): bool
    {
        return $this->executeEvent;
    }

    public function setExecuteEvent(bool $executeEvent): self
    {
        $this->executeEvent = $executeEvent;

        return $this;
    }


}
