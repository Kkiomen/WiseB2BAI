<?php

namespace App\Http\Controllers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Models\KnowledgeBase;
use Storage;


class InitController extends Controller
{

    public function init(LanguageModel $languageModel)
    {
        KnowledgeBase::truncate();

        $embedingsCount = KnowledgeBase::where('header', 'Kogo dotyczy obowiązek podatkowy')->count();

        if ($embedingsCount < 3) {
            $this->prepareEmbedings($languageModel);
        }
    }

    protected function prepareEmbedings(LanguageModel $languageModel): void
    {
        $embedingsSrcOtherJson = Storage::get('knowledge_base/rozliczenie-podatku-pcc-od-innych-czynnosci.json');
        $embedingsSrcCarJson = Storage::get('knowledge_base/rozliczenie-podatku-pcc-od-kupna-samochodu.json');
        $embedingsSrcLoanJson = Storage::get('knowledge_base/rozliczenie-podatku-pcc-od-pozyczki.json');
        $embedingsSrcFieldsJson = Storage::get('knowledge_base/pola-wyjasnienia.json');

        $embedingsSrcCar = json_decode($embedingsSrcCarJson, true);
        $embedingsSrcLoan = json_decode($embedingsSrcLoanJson, true);
        $embedingsSrcOther = json_decode($embedingsSrcOtherJson, true);
        $embedingsSrcFields = json_decode($embedingsSrcFieldsJson, true);

        $embedings = array_merge($embedingsSrcOther, $embedingsSrcLoan, $embedingsSrcCar, $embedingsSrcFields);

        foreach ($embedings as $embeding) {

            $contentToSave = $embeding['header'] . ' ' . $embeding['content'];

            $knowledgeBase = new KnowledgeBase();

            $knowledgeBase->md5 = md5($contentToSave);
            $knowledgeBase->embedded = $languageModel->embeddedString($contentToSave);
            $knowledgeBase->header = $embeding['header'];
            $knowledgeBase->parse_content = $contentToSave;

            $knowledgeBase->save();
        }
    }
}
