<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Enums;

enum ResponseType: string
{
    case JSON = 'json';
    case STREAM = 'stream';
}
