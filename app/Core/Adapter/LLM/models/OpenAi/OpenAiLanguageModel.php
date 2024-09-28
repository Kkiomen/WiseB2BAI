<?php

namespace App\Core\Adapter\LLM\models\OpenAi;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use OpenAI\Client;

class OpenAiLanguageModel implements LanguageModel
{
    private Client $client;

    public function __construct(){
        $this->client = \OpenAI::client(getenv('OPEN_AI_KEY'));
    }

    public function generate(string $prompt, string $systemPrompt, LanguageModelSettings $settings): string
    {
        $openAiModel = $this->getOpenAiModelBySettings($settings);

        $openAiModelParamsToGenerate = [
            'temperature' => $settings->getTemperature(),
            'model' => $openAiModel->value,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $prompt]
            ]
        ];

        $response = $this->client->chat()->create($openAiModelParamsToGenerate);
        return $response->choices[0]->message->content;
    }

    public function generateStream(string $prompt, string $systemPrompt, LanguageModelSettings $settings): mixed
    {
        $openAiModel = $this->getOpenAiModelBySettings($settings);

        $openAiModelParamsToGenerate = [
            'temperature' => $settings->getTemperature(),
            'model' => $openAiModel->value,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $prompt]
            ]
        ];

        return $this->client->chat()->createStreamed($openAiModelParamsToGenerate);
    }


    protected function getOpenAiModelBySettings(LanguageModelSettings $languageModelSettings): OpenAiModel
    {
        /** @var OpenAiModel $model */
        $model = match ($languageModelSettings->getLanguageModelType()) {
            LanguageModelType::NORMAL => OpenAiModel::GPT_4_O_MINI,
            LanguageModelType::INTELLIGENT => OpenAiModel::GPT_4_O
        };

        return $model;
    }

    public function generateStreamWithConversation(string $prompt, string $systemPrompt, LanguageModelSettings $settings, \Illuminate\Database\Eloquent\Collection $collectionOfMessages): mixed
    {
        $messages = [];
        $openAiModel = $this->getOpenAiModelBySettings($settings);

        // ============ Prepare Messages ============
        $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        foreach ($collectionOfMessages as $message){
            if(!empty($message->prompt)){
                $messages[] = ['role' => 'user', 'content' => $message->prompt];
            }

//
//            if(!empty($message->getResult())){
//                $sqlQueries = !empty($message->getQueries()) ? 'To generate was used SQLs: '. $message->getQueries() : '';
//                $messages[] = ['role' => 'user', 'content' => $message->getResult() . $sqlQueries];
//            }

        }
        $messages[] = ['role' => 'user', 'content' => $prompt];
        // ============ Prepare Messages ============

        $openAiModelParamsToGenerate = [
            'temperature' => $settings->getTemperature(),
            'model' => $openAiModel->value,
            'messages' => $messages
        ];

        return $this->client->chat()->createStreamed($openAiModelParamsToGenerate);
    }

    public function embeddedString(string $content): mixed
    {
        $response = $this->client->embeddings()->create([
            'model' => OpenAiModel::TEXT_EMBEDDING_ADA->value,
            'input' => $content
        ]);

        foreach ($response->embeddings as $embedding){
            return $embedding->embedding;
        }

        return null;
    }

    public function checkModels(): mixed
    {
        return $this->client->models()->list();
    }
}
