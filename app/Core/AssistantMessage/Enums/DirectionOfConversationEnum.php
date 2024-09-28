<?php

namespace App\Core\AssistantMessage\Enums;

enum DirectionOfConversationEnum: string
{
    case HELP_WITH_DECLARATION = 'HELP_WITH_DECLARATION';
    case QUESTION = 'ASK_QUESTION';

    public static function values(): array
    {
        return [
            self::HELP_WITH_DECLARATION->value,
            self::QUESTION->value,
        ];
    }
}
