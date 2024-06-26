<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events;

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
        ];
    }
}
