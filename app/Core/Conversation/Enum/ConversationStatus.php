<?php

namespace App\Core\Conversation\Enum;

enum ConversationStatus: string
{
    case ASSISTANT = 'assistant';
    case CONSULTANT = 'consultant';

    public static function toArray(): array
    {
        return [
            self::ASSISTANT->value,
            self::CONSULTANT->value
        ];
    }
}
