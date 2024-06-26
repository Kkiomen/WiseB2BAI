<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Service;

use App\Models\Conversation;
use Illuminate\Database\Eloquent\Collection;

class ConversationService
{

    public function __construct()
    {

    }


    public function getOrCreateConversations(string $sessionHash): Conversation
    {
        $conversation = Conversation::where('session_hash', $sessionHash)->first();

        if($conversation){
            return $conversation;
        }

        $conversation = new Conversation();
        $conversation->session_hash = $sessionHash;
        $conversation->save();
        return $conversation;
    }

    public function getConversationMessages(string $sessionHash): Collection
    {
        $conversation = Conversation::where('session_hash', $sessionHash)->first();

        if($conversation){
            return $conversation->messages()->orderBy('created_at')->get();
        }

        return new Collection();
    }
}
