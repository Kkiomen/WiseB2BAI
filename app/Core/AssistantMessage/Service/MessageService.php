<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Service;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Models\Message;

class MessageService
{
    public function __construct(
        private readonly ConversationService $conversationService
    ){}

    public function createMessage(MessageProcessor $messageProcessor, bool $withSave = true): Message
    {
        $conversation = $this->conversationService->getOrCreateConversations($messageProcessor->getSessionHash());

        $message = new Message();
        $message->conversation_id = $conversation->id;
        if($withSave){
            $message = $message->save();
        }

        return $message;
    }
}
