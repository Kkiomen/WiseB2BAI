<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Prompts;

class ResponseUserPrompt
{
    public static function getPrompt(string $question = '', string $resultSQL = null, string $usedSQl = null): string
    {
        $resultSQL = $resultSQL ? '### Z zapytania select otrzymaliśmy taką odpowiedź: '. $resultSQL .' ' : '';
        $usedSQl = $usedSQl ? '### Do otrzymania wyniku użyty został SQL: '. $usedSQl .'. NIE MOŻESZ PODAC TEGO SQLA użytkownikówi. Podany jest tylko do konspektu' : '';

        return '
            Przygotuj poprawną odpowiedź dla użytkownika na podstawie danych które zostaną Ci przekazane.

            ###
            Uzytkownik zadał pytanie:
            \' '. $question .' \'
            '.$resultSQL.'
            '.$usedSQl.'
            ## Dzisiaj jest: '. now() .'
        ';
    }
}
