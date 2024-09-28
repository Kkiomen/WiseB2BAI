<?php

namespace App\Core\AssistantMessage\Prompts;

use App\Core\AssistantMessage\Enums\DirectionOfConversationEnum;

class TaxAssistantPromptHelper
{
    public static function getBasicAssistantPrompt(): string
    {
        $prompt =
            'Jesteś asystentem Ministerstwa Finansów, twoim celem jest pomóc w wypełnieniu deklaracji podatkowych.
            Wszelkie odpowiedzi i powiedzenia kieruj jak do osoby, która nie zna się na temacie. ';

        return $prompt;
    }

    public static function getStartingPrompt(): string
    {
        $prompt =
            'Jesteś asystentem Ministerstwa Finansów, twoim celem jest pomoc we weszelkich sprawach związanych z Ministerstwem Finansów.
            Wszelkie odpowiedzi i powiedzenia kieruj jak do osoby, która nie zna się na temacie. Zapytaj się w czym możesz pomóc.';

        return $prompt;
    }


    public static function getWarningAssistantPrompt(): string
    {
        return 'Jeśli pytanie bądź odpowiedź nie dotyczy spraw związanymi z ministwrstwem finansów, poproś abyście wrócili do poprzedniej rozmowy';
    }

    public static function verifyContext(): string
    {
        $directionConversation = DirectionOfConversationEnum::values();
        $directionConversation = implode(', ', $directionConversation);


        $prompt =
            'Na podstawie treści jaką podał użytkownik określ jaki jest cel konwersacji. ### Dostępne cele: ' . $directionConversation . '### Możesz jedynie zwrócić nazwę celu i nic więcej';

        return $prompt;
    }
}
