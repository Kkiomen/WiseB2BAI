<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Prompts\Abstract;

class Prompt
{
    const PROMPT = 'Say hey';

    protected array $options = [];

    public static function getPrompt(): string
    {
        return static::getPrompt();
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setOptions(array $options): self
    {
        $this->options = $options;

        return $this;
    }
}
