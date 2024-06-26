<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'assistant_id', 'consultant_id', 'session_hash', 'title', 'active', 'status'
    ];

    public function messages(){
        return $this->hasMany(Message::class);
    }
}
