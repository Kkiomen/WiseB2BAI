<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\MessageInterpreter;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Service\EntityService;
use Illuminate\Support\Facades\File;

class PrepareHelperForCreateEndpointHelper
{
    public function __construct(
        private readonly LanguageModel $languageModel,
        private readonly EntityService $entityService
    ){}

    public function prepareHelperForCreateEndpointHelper(string $userPrompt): string
    {
        $prompt = '
        Na podstawie opisu użytkownika zwróć JSON opisujący jakich encji może dotyczyć zapytanie
        ####
        Lista encji:
        ' . $this->entityService->getListOfEntities() . '

        ###
        Nazwa serwisu dotyczy głównej encji. Tam będą Joiny do innych encji.
        Nazwa serwisu budowana jest za pomocą `List{EntityName}ServiceInterface`

        ###
        Odpowiedź podaj w formie JSON i tylko JSON (przykład i format)
        {
            "listOfEntities": ["Order","Products","Client"],
            "nameOfServiceEntityList":"ListOrderServiceInterface"
        }';

        $helpersInfo = json_decode($this->languageModel->generate(
            $userPrompt,
            $prompt,
            (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::NORMAL)
        ), true);

        $entitiesInfos = $this->entityService->getEntitiesHelperInformation($helpersInfo['listOfEntities']);
        $serviceInfo = $helpersInfo['nameOfServiceEntityList'];

        return '####### Poniżej przedstawię Ci informacje, które mają Ci pomóc w stworzeniu endpointu: #### Informacje o encjach: ' . $entitiesInfos . ' #######' . '####### Informacje o serwisie: ' . $serviceInfo . ' #######';
    }

    public function prepareFullPromptSystem(string $promptUser): string
    {
        $filePath = base_path('docs/docs/architektura/jak-stworzyc-endpoint-get.md');
        $content = File::get($filePath);

        $prompt = 'Jesteś Senior PHP developerem. Twoim zadaniem jest pomoc użytkownikowi w stworzeniu endpointa. Przedstaw krok po kroku jak to zrobić na podstawie poniższych informacji oraz instrukcji.';
        $prompt .= $this->prepareHelperForCreateEndpointHelper($promptUser);
        $prompt .= $this->prepareContentForPrompt($content);

        return $prompt;
    }

    /**
     * Prepare the content for the prompt.
     * @param string $content
     * @param int $maxLength
     * @return string
     */
    protected function prepareContentForPrompt(string $content, int $maxLength = 4000): string {
        // Usuń nadmiarowe spacje i entery
        $content = preg_replace('/\s+/', ' ', $content);
        $content = trim($content);

        // Skróć string do zadanej długości, nie usuwając ważnej zawartości
        if (strlen($content) > $maxLength) {
            $content = substr($content, 0, $maxLength);

            // Znajdź ostatnie wystąpienie pełnego zdania, aby nie przerwać treści
            $lastSentenceEnd = max(strrpos($content, '.'), strrpos($content, '!'), strrpos($content, '?'));
            if ($lastSentenceEnd !== false) {
                $content = substr($content, 0, $lastSentenceEnd + 1);
            } else {
                // Jeśli nie znaleziono końca zdania, ucinamy w najbliższym sensownym miejscu
                $content = substr($content, 0, strrpos($content, ' ')) . '...';
            }
        }

        return $content;
    }
}
