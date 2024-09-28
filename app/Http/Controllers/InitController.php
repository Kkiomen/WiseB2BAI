<?php

namespace App\Http\Controllers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Models\KnowledgeBase;
use League\Csv\Reader;
use Storage;
use Illuminate\Support\Facades\Storage;


class InitController extends Controller
{

    public function init(LanguageModel $languageModel)
    {
        $this->prepareUsList($languageModel);
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

    protected function prepareUsList(LanguageModel $languageModel): void
    {
        $csv = Reader::createFromPath(Storage::path('knowledge_base/20240916_Dane_teleadresowe_jednostek_KAS.csv'), 'r');
        $csv->setHeaderOffset(0);

        $records = $csv->getRecords();

        foreach ($records as $record) {
            if ($record['TYP'] != 'US') {
                continue;
            }
            $contentToSave = $record['NAZWA URZĘDU'] . ' ' . $record['ULICA'] . ' ' . $record['NR BUDYNKU / LOKALU'] . ' ' . $record['MIASTO'];

            $knowledgeBase = new KnowledgeBase();

            $knowledgeBase->md5 = md5($contentToSave);
            $knowledgeBase->embedded = $languageModel->embeddedString($contentToSave);
            $knowledgeBase->header = $record['NAZWA URZĘDU'];
            $knowledgeBase->parse_content = $contentToSave;

            $knowledgeBase->save();
        }
    }
}
