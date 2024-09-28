<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter\Types\Abstract;

use App\Core\AssistantMessage\MessageInterpreter\Types\DocsHelperMessageType;
use App\Core\AssistantMessage\MessageInterpreter\Types\HelperEndpointCreateType;
use App\Core\AssistantMessage\MessageInterpreter\Types\ProductsInterpreterMessageType;
use App\Core\AssistantMessage\MessageInterpreter\Types\TaxAssistantMessageType;

final class InterpreterMessageTypeLists
{
    public function getList(): array
    {
        return [
            ProductsInterpreterMessageType::class,
            DocsHelperMessageType::class,
            HelperEndpointCreateType::class,
            TaxAssistantMessageType::class
        ];
    }
}
