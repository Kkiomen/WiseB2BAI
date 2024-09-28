<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto;

use App\Core\AssistantMessage\Dto\Logger\LoggerSql;
use App\Core\AssistantMessage\Dto\Logger\LoggerSteps;
use App\Models\Message;
use Illuminate\Database\Eloquent\Collection;

class MessageProcessor
{
    private ?string $messageFromUser = null;
    private string $systemPrompt = 'DEFAULT';
    private LoggerSteps $loggerStep;
    private LoggerSql $loggerSql;
    private ?string $functionClass = null;

    private ?string $sessionHash = null;

    private Message|bool $message;

    private Collection $conversationMessages;

    private ?string $type = null;

    public function __construct()
    {
        $this->loggerStep = new LoggerSteps();
        $this->loggerSql = new LoggerSql();
    }


    public function getMessageFromUser(): ?string
    {
        return $this->messageFromUser;
    }

    public function setMessageFromUser(?string $messageFromUser): self
    {
        $this->messageFromUser = $messageFromUser;

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


    //  ====  Logger Steps  ====

    public function getLoggerStep(): LoggerSteps
    {
        return $this->loggerStep;
    }

    public function setLoggerStep(LoggerSteps $loggerStep): self
    {
        $this->loggerStep = $loggerStep;

        return $this;
    }


    //  ====  Logger Steps  ====

    //  ====  Function Class  ====

    public function getFunctionClass(): ?string
    {
        return $this->functionClass;
    }

    public function setFunctionClass(?string $functionClass): self
    {
        $this->functionClass = $functionClass;

        return $this;
    }

    //  ====  Function Class  ====

    //  ====  Logger Sql  ====

    public function getLoggerSql(): LoggerSql
    {
        return $this->loggerSql;
    }

    public function setLoggerSql(LoggerSql $loggerSql): self
    {
        $this->loggerSql = $loggerSql;

        return $this;
    }

    //  ====  Logger Sql  ====


    public function getSessionHash(): ?string
    {
        return $this->sessionHash;
    }

    public function setSessionHash(?string $sessionHash): void
    {
        $this->sessionHash = $sessionHash;
    }

    public function getMessage(): Message
    {
        return $this->message;
    }

    public function setMessage(Message|bool $message): self
    {
        $this->message = $message;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
