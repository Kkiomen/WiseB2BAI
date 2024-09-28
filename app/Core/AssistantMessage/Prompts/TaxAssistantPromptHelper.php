<?php

namespace App\Core\AssistantMessage\Prompts;

use App\Core\AssistantMessage\Enums\DirectionOfConversationEnum;
use Illuminate\Support\Facades\Storage;

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


    public static function getPromptToReturnListFieldsToFill(): string
    {
        $data = Storage::get('declaration_fields/pcc-3/fields.json');
        $data = json_decode($data, true);
        $dataResult = [];
        $result = '[';
        foreach ($data as $field){
            $dataResult[] = '{field_number: "'.$field['number'].'", field_name: "'.$field['name'].'", field_type: "'.$field['type'].'", field_required: "'.$field['required'].'", field_description: "'.$field['description'] . ' ' . $field['rules'].'"" }';
        }
        $result .= implode(', ', $dataResult);
        $result .= ']';


        $prompt =
            'Jesteś asystentem deklaracji podatkowej. Twoim zadaniem jest identyfikacja wymaganych pól na podstawie opisu użytkownika. Otrzymujesz informacje o polach w deklaracji, w tym ich numer, nazwę, typ danych, czy są wymagane, opis i zasady wypełniania. Na podstawie tych informacji oraz kontekstu transakcji opisanego przez użytkownika, określ listę pól, które muszą być wypełnione, oraz dodatkowe informacje, takie jak stawki podatku. Weź pod uwagę pola wymagane jak i nie wymagane (jeśli istnieją pod sytuacje użytkownika). Uwzględnij instrukcje w "rules". Zwróć uwagę, że field ma pole rules, które również steruje czy pole ma zostać wyświetlone ### Pola: ' . $result . '### Oczekiwany Output: Wymieniasz wszystkie wymagane pola, które użytkownik musi wypełnić. Zwróc mi odpowiedź w formacie JSON i tylko JSON (Bez markdown) [{\'field_number\': \'XYZ\'},...]';

        return $prompt;
    }
}
