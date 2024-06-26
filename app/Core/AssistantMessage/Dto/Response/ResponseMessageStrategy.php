<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\Response;

use App\Core\Assistant\Enum\AssistantType;
use App\Core\AssistantMessage\Dto\History\PromptHistory;
use App\Core\AssistantMessage\Enums\ResponseType;
use App\Models\Message;

class ResponseMessageStrategy
{
    private ?string $content;
    private PromptHistory $prompt;
    private ?array $other;
    private ResponseType $responseType;
    private Message $messageDTO;
    private array $links;
    private ?AssistantType $type;

    public function __construct()
    {
        $this->prompt = new PromptHistory(null, null);
        $this->responseType = ResponseType::JSON;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getPrompt(): PromptHistory
    {
        return $this->prompt;
    }

    public function setPrompt(PromptHistory $prompt): self
    {
        $this->prompt = $prompt;
        return $this;
    }

    public function getOther(): ?array
    {
        return $this->other;
    }

    public function setOther(?array $other): self
    {
        $this->other = $other;
        return $this;
    }

    public function getResponseType(): ResponseType
    {
        return $this->responseType;
    }

    public function setResponseType(ResponseType $responseType): self
    {
        $this->responseType = $responseType;
        return $this;
    }

    public function getMessageDTO(): Message
    {
        return $this->messageDTO;
    }

    public function setMessageDTO(Message $messageDTO): self
    {
        $this->messageDTO = $messageDTO;
        return $this;
    }

    public function getLinks(): ?array
    {
        return $this->links ?? null;
    }

    public function setLinks(array $links): self
    {
        $this->links = $links;
        return $this;
    }

    public function getType(): ?AssistantType
    {
        return $this->type;
    }

    public function setType(?AssistantType $type): void
    {
        $this->type = $type;
    }
}
