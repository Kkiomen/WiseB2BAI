<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events\Core\Abstract;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;

abstract class Event
{
    /**
     * @var string|null $name The name of the event
     * @example 'calendar'
     */
    protected ?string $name = null;

    /**
     * @var string|null $description A brief description of the event. Based on this variable, an event is selected
     * @example 'adding an event to the calendar and only adds the event'
     */
    protected ?string $description = null;

    /**
     * @var array $triggers List of triggers to initiate the event
     * @example ['calendar', 'event']
     */
    protected array $triggers = [];

    /**
     * @var array $tableListToPrompt List of table to used in prompt
     * @example ['TablePrompt::CLIENTS', 'TablePrompt::PRODUCTS']
     */
    protected array $tableListToPrompt = [];

    /**
     * @return string|null The name of the event
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @return string|null A brief description of the event. Based on this variable, an event is selected
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @return array List of triggers to initiate the event
     */
    public function getTriggers(): array
    {
        return $this->triggers ?? [];
    }

    /**
     * Handle the event.
     *
     * @param  MessageProcessor  $messageProcessor
     * @return EventResult Response after handling the event
     */
    abstract public function handle(MessageProcessor $messageProcessor): EventResult;
}
