<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\Response;

use App\Core\Adapter\LLM\models\OpenAi\OpenAiModel;
use App\Core\AssistantMessage\Dto\Logger\LoggerSql;
use App\Core\AssistantMessage\Dto\Logger\LoggerSteps;
use App\Models\Message;
use Illuminate\Database\Eloquent\Collection;

class ResponseDTO
{
    private string $userMessage;
    private string $systemPrompt;
    private OpenAiModel $openAiModel = OpenAiModel::GPT_3_5_TURBO;
    private float $temperature = 0.9;
    private ?LoggerSteps $loggerStep = null;
    private ?LoggerSql $loggerSql = null;
    private array $table = [];
    private ?array $data = [];
    private string $type = 'basic';
    private ?Message $message;
    private Collection $conversationMessages;

    public function getUserMessage(): string
    {
        return $this->userMessage;
    }

    public function setUserMessage(string $userMessage): self
    {
        $this->userMessage = $userMessage;

        return $this;
    }

    public function getSystemPrompt(): string
    {
        return $this->systemPrompt;
    }

    public function setSystemPrompt(string $systemPrompt): self
    {
        $this->systemPrompt = $systemPrompt;

        return $this;
    }

    public function getOpenAiModel(): OpenAiModel
    {
        return $this->openAiModel;
    }

    public function setOpenAiModel(OpenAiModel $openAiModel): self
    {
        $this->openAiModel = $openAiModel;

        return $this;
    }

    public function getTemperature(): float
    {
        return $this->temperature;
    }

    public function setTemperature(float $temperature): self
    {
        $this->temperature = $temperature;

        return $this;
    }

    public function getLoggerStep(): ?LoggerSteps
    {
        return $this->loggerStep;
    }

    public function setLoggerStep(?LoggerSteps $loggerStep): self
    {
        $this->loggerStep = $loggerStep;

        return $this;
    }

    public function getTable(): array
    {
        return $this->table ?? [];
    }

    public function setTable(array $table): self
    {
        $this->table = $table;

        return $this;
    }

    public function getMessage(): ?Message
    {
        return $this->message;
    }

    public function setMessage(?Message $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getLoggerSql(): ?LoggerSql
    {
        return $this->loggerSql;
    }

    public function setLoggerSql(?LoggerSql $loggerSql): self
    {
        $this->loggerSql = $loggerSql;

        return $this;
    }

    public function getConversationMessages(): Collection
    {
        return $this->conversationMessages;
    }

    public function setConversationMessages(Collection $conversationMessages): self
    {
        $this->conversationMessages = $conversationMessages;

        return $this;
    }

    public function getData(): ?array
    {
        return $this->data;
    }

    public function setData(?array $data): self
    {
        $this->data = $data;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
