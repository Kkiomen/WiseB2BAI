<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\Response;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Prompts\ResponseUserPrompt;

abstract class AbstractResponseResult
{
    private ?MessageProcessor $messageProcessor = null;

    private ?string $resultResponseSystemPrompt = null;

    private ?string $resultResponseUserMessage = null;

    private ?float $resultResponseTemperature = null;

    private ?array $resultResponseTable = null;
    private array $data = [];

    public function setResultResponseSystemPrompt(?string $resultResponseSystemPrompt): self
    {
        if($this->messageProcessor !== null){
            $this->messageProcessor->setSystemPrompt($resultResponseSystemPrompt);
        }
        $this->resultResponseSystemPrompt = $resultResponseSystemPrompt;

        return $this;
    }

    public function getResultResponseSystemPrompt(bool $strict = false): ?string
    {
        $result = $this->resultResponseSystemPrompt;

        if($strict == false && $result === null){
            $question = $this->messageProcessor->getMessageFromUser() ?? '';
            $result = ResponseUserPrompt::getPrompt($question, '', '');
        }

        return $result;
    }

    public function setMessageProcessor(?MessageProcessor $messageProcessor): self
    {
        $this->messageProcessor = $messageProcessor;

        return $this;
    }

    public function getMessageProcessor(): ?MessageProcessor
    {
        return $this->messageProcessor;
    }

    public function getResultResponseUserMessage(): ?string
    {
        return $this->resultResponseUserMessage;
    }

    public function setResultResponseUserMessage(?string $resultResponseUserMessage): self
    {
        $this->resultResponseUserMessage = $resultResponseUserMessage;

        return $this;
    }

    public function getResultResponseTemperature(): ?float
    {
        return $this->resultResponseTemperature;
    }

    public function setResultResponseTemperature(?float $resultResponseTemperature): self
    {
        $this->resultResponseTemperature = $resultResponseTemperature;

        return $this;
    }

    public function getResultResponseTable(): ?array
    {
        return $this->resultResponseTable ?? [];
    }

    public function setResultResponseTable(?array $resultResponseTable): self
    {
        $this->resultResponseTable = $resultResponseTable;

        return $this;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): self
    {
        $this->data = $data;

        return $this;
    }


}
