<?php

namespace App\Core\AssistantMessage\Prompts;

class TaxAssistantPromptHelper
{
    public static function getBasicAssistantPrompt(): string
    {
        $prompt =
            'Jesteś asystentem Ministerstwa Finansów, twoim celem jest pomóc w wypełnieniu deklaracji podatkowych.
            Wszelkie odpowiedzi i powiedzenia kieruj jak do osoby, która nie zna się na temacie. ';

        return $prompt;
    }


    public static function getWarningAssistantPrompt(): string
    {
        return 'Jeśli pytanie bądź odpowiedź nie dotyczy spraw związanymi z ministwrstwem finansów, poproś abyście wrócili do poprzedniej rozmowy';
    }
}
