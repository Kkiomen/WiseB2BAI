<?php

namespace App\Core\AssistantMessage\MessageInterpreter\Types;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\Types\Abstract\AbstractInterpreterMessageType;
use App\Core\AssistantMessage\Prompts\PrepareInterpreterSearchProductPrompt;
use App\Core\dd;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductsInterpreterMessageType extends AbstractInterpreterMessageType
{

    protected ?string $type = 'products';
    protected function interpreterMessage(MessageProcessor $messageProcessor): InterpretationDetails
    {
        $result = new InterpretationDetails();
        $result->setExecuteEvent(true);

        return $result;
    }
}
