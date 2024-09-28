<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'assistant_id', 'consultant_id', 'session_hash', 'title', 'active', 'status'
    ];

    public static function boot()
    {
        parent::boot();

        self::created(function($model){
            $conversationDeclarationTemporaryData = new ConversationDeclarationTemporaryData();
            $conversationDeclarationTemporaryData->conversation_id = $model->id;
            $conversationDeclarationTemporaryData->save();
        });
    }

    public function messages(){
        return $this->hasMany(Message::class);
    }

    public function declarationTemporaryData(): HasOne
    {
        return $this->hasOne(ConversationDeclarationTemporaryData::class);
    }
}
