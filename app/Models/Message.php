<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
      'user_id', 'conversation_id', 'content', 'sender_class', 'sender_id', 'prompt', 'system', 'result', 'links', 'steps', 'queries', 'table'
    ];
}
