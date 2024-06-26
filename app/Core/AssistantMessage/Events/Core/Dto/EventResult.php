<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events\Core\Dto;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Dto\Response\AbstractResponseResult;
use App\Core\AssistantMessage\Prompts\ResponseUserPrompt;

class EventResult extends AbstractResponseResult
{
    private ?bool $handleWithEvent = false;

    public function getHandleWithEvent(): ?bool
    {
        return $this->handleWithEvent;
    }

    public function setHandleWithEvent(?bool $handleWithEvent): self
    {
        $this->handleWithEvent = $handleWithEvent;

        return $this;
    }
}
