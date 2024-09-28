<?php

namespace App\Http\Controllers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Models\KnowledgeBase;


class TestController extends Controller
{

    public function test(LanguageModel $languageModel)
    {
        $header = 'COSTAM';
        $content = 'EXAMPLE';
        $contentToSave = $header . ' ' . $content;

        $knowledgeBase = new KnowledgeBase();
        $knowledgeBase->md5 = md5($contentToSave);
        $knowledgeBase->embedded = $languageModel->embeddedString($contentToSave);
        $knowledgeBase->header = $header;
        $knowledgeBase->parse_content = $contentToSave;
        $knowledgeBase->save();

    }
}
