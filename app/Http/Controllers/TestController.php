<?php

namespace App\Http\Controllers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Prompts\TaxAssistantPromptHelper;
use App\Core\dd;
use App\Models\KnowledgeBase;
use Illuminate\Support\Facades\Storage;


class TestController extends Controller
{

    public function test(LanguageModel $languageModel)
    {
        $prumpt = 'Wczoraj kupiłem na giełdzie samochodowej Fiata 126p rok prod. 1975, kolor zielony. Przejechane ma
1000000 km, idzie jak przecinak, nic nie stuka, nic nie puka, dosłownie igła. Zapłaciłem za niego 1000
zł ale jego wartość jest wyższa o 2000 zł i co mam z tym zrobić ?';

       $fields_json =  $languageModel->generate(
            prompt: $prumpt,
            systemPrompt: TaxAssistantPromptHelper::getPromptToReturnListFieldsToFill(),
            settings: (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::INTELLIGENT)
        );

       try{
           $fields_json = str_replace(['\n', ' '], '', $fields_json);
           dump($fields_json);
           $fields_json = json_decode($fields_json, true);
           dd($fields_json);
       }catch (\Exception $exception){
           echo 'DAJ KURWA SPOKÓJ MNIE NA DZISAIJ';
       }
    }
}
