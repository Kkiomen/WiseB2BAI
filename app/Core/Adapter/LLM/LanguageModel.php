<?php

namespace App\Core\Adapter\LLM;


interface LanguageModel
{
    public function generate(string $prompt, string $systemPrompt, LanguageModelSettings $settings): string;
    public function generateStream(string $prompt, string $systemPrompt, LanguageModelSettings $settings): mixed;
    public function generateStreamWithConversation(string $prompt, string $systemPrompt, LanguageModelSettings $settings, \Illuminate\Database\Eloquent\Collection $collectionOfMessages): mixed;
    public function embeddedString(string $content): mixed;
}
