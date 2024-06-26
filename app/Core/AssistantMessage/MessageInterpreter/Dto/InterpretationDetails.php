<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Dto;

use App\Core\AssistantMessage\Dto\Response\AbstractResponseResult;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;

class InterpretationDetails extends AbstractResponseResult
{
    private string $type = 'basic';
    private ?Event $interpretedClass = null;
    private bool $executeEvent = true;
    private ?string $interpreterType = null;

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getInterpretedClass(): ?Event
    {
        return $this->interpretedClass;
    }

    public function setInterpretedClass(?Event $interpretedClass): self
    {
        $this->interpretedClass = $interpretedClass;

        return $this;
    }

    public function isExecuteEvent(): bool
    {
        return $this->executeEvent;
    }

    public function setExecuteEvent(bool $executeEvent): self
    {
        $this->executeEvent = $executeEvent;

        return $this;
    }

    public function getInterpreterType(): ?string
    {
        return $this->interpreterType;
    }

    public function setInterpreterType(?string $interpreterType): self
    {
        $this->interpreterType = $interpreterType;

        return $this;
    }
}
