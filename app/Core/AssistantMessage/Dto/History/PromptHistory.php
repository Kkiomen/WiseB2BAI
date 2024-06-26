<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\History;

class PromptHistory
{
    private ?string $prompt;
    private ?string $system;

    public function __construct(string|null $prompt, string|null $system)
    {
        $this->prompt = $prompt ?? null;
        $this->system = $system ?? null;
    }

    public function getPrompt(): ?string
    {
        return $this->prompt;
    }

    public function setPrompt(string $prompt): self
    {
        $this->prompt = $prompt;
        return $this;
    }

    public function getSystem(): ?string
    {
        return $this->system;
    }

    public function setSystem(string $system): self
    {
        $this->system = $system;
        return $this;
    }
}
