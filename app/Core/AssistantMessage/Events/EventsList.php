<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events;

use App\Core\AssistantMessage\Events\TaxAssistants\JailBreakEvent;

final class EventsList
{
    /**
     * List of all functionality
     * @return array
     */
    public function getList(): array
    {
        return [
            'products' => [
                'useTriggers' => false,
                'events' => [
                    FindProductEvent::class,
                    HelpToFindProductEvent::class
                ]
            ],
            'tax_assistant' => [
                'useTriggers' => false,
                'events' => [
                    JailBreakEvent::class
                ]
            ],
        ];
    }
}
