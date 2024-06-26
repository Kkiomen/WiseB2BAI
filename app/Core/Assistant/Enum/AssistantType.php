<?php

namespace App\Core\Assistant\Enum;

enum AssistantType: string
{
    /**
     * Basic assistant using long-term memory to help the user
     */
    case BASIC = 'basic';

    /**
     * Supports the ability to use the claims system
     */
    case COMPLAINT = 'complaint';

    public static function toArray(): array
    {
        return [
          self::BASIC->value,
          self::COMPLAINT->value
        ];
    }
}
