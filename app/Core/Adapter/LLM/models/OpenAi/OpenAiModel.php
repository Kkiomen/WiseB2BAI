<?php

namespace App\Core\Adapter\LLM\models\OpenAi;

enum OpenAiModel: string
{
    case DAVINCI = 'text-davinci-003';
    case GPT_3_5_TURBO = 'gpt-3.5-turbo';
    case GPT_4 = 'gpt-4';
    case GPT_4_O = 'gpt-4o';
    case GPT_4_O_MINI = 'gpt-4o-mini';
    case TEXT_EMBEDDING_ADA  = 'text-embedding-ada-002';
}
