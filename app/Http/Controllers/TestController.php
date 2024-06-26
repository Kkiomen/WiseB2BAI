<?php

namespace App\Http\Controllers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\MessageInterpreter\PrepareHelperForCreateEndpointHelper;
use App\Core\AssistantMessage\Prompts\PrepareInterpreterSearchProductPrompt;
use App\Core\AssistantMessage\Service\EntityService;
use App\Core\dd;
use App\Models\DocFile;
use App\Models\KnowledgeBase;
use App\Models\Product;
use App\Services\DocumentationService;
use App\Services\KnowledgeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Notion\Notion;
use Illuminate\Support\Facades\File;

class TestController extends Controller
{
    public function __construct(
        private readonly LanguageModel $languageModel,
        private readonly DocumentationService $documentationService,
        private readonly KnowledgeService $knowledgeService,
        private readonly EntityService $entityService,
        private readonly PrepareHelperForCreateEndpointHelper $prepareHelperForCreateEndpointHelper
    )
    {

    }

    public function test(LanguageModel $languageModel)
    {
        dd($this->prepareHelperForCreateEndpointHelper->prepareFullPromptSystem('Stwórz endpoint, który zwróci wszystkie produkty, utworzone starzej niż 10 dni. Dodatkowo dorzuć informacje o translacjach'));

        $filePath = base_path('docs/docs/architektura/jak-stworzyc-endpoint-get.md');
        dd(File::exists($filePath));
        dd($this->prepareHelperForCreateEndpointHelper->prepareHelperForCreateEndpointHelper('Stwórz endpoint, który zwróci wszystkie produkty, utworzone starzej niż 10 dni. Dodatkowo dorzuć informacje o translacjach'));


        $elementsHelper = json_decode($json, true);

        //$this->entityService->getEntityHelperInformation($elementsHelper['listOfEntities'])


        /**
         * {"listOfEntities":["Order","Products","Client"],"nameOfEntityListService":"ListOrdersServiceInterface"}
         */
        dd($this->entityService->getListOfEntities());

        $preparedDocumentationFiles = $this->documentationService->parseAllFiles();
        $currentKnowledgeBases = KnowledgeBase::all()->toArray();

        $docFiles = DocFile::all()->toArray();


        $this->processDocumentationFiles($languageModel, $preparedDocumentationFiles, $currentKnowledgeBases, $docFiles);
        $this->deleteUnusedDocFiles($docFiles);
        $this->deleteUnusedKnowledgeBases($currentKnowledgeBases);

    }

    /**
     * Process the parsed documentation files.
     *
     * @param LanguageModel $languageModel
     * @param array $preparedDocumentationFiles
     * @param array $currentKnowledgeBases
     * @param array $docFiles
     * @return void
     */
    protected function processDocumentationFiles(LanguageModel $languageModel, array $preparedDocumentationFiles, array &$currentKnowledgeBases, array &$docFiles): void
    {
        foreach ($preparedDocumentationFiles as $file) {
            $docFile = $this->getDocFileIfExists($file['dir']);
            if ($docFile) {
                $this->updateDocFile($docFile, $file);
                $this->removeProcessedDocFile($docFiles, $file['dir']);
            } else {
                $this->createDocFile($file);
            }

            $this->processKnowledgeBaseContent($languageModel, $file, $currentKnowledgeBases);
        }
    }

    /**
     * Update the DocFile if it exists.
     *
     * @param DocFile $docFile
     * @param array $file
     * @return void
     */
    protected function updateDocFile(DocFile $docFile, array $file): void
    {
        if ($docFile->md5 !== $file['md5']) {
            $docFile->md5 = $file['md5'];
            $docFile->save();
        }
    }

    /**
     * Remove the processed DocFile from the list.
     *
     * @param array $docFiles
     * @param string $filename
     * @return void
     */
    protected function removeProcessedDocFile(array &$docFiles, string $filename): void
    {
        foreach ($docFiles as $key => $currentDocFile) {
            if ($currentDocFile['filename'] === $filename) {
                unset($docFiles[$key]);
            }
        }
    }

    /**
     * Create a new DocFile.
     *
     * @param array $file
     * @return void
     */
    protected function createDocFile(array $file): void
    {
        $documentationFile = new DocFile();
        $documentationFile->filename = $file['dir'];
        $documentationFile->md5 = $file['md5'];
        $documentationFile->save();
    }

    /**
     * Process the knowledge base content.
     *
     * @param LanguageModel $languageModel
     * @param array $file
     * @param array $currentKnowledgeBases
     * @return void
     */
    protected function processKnowledgeBaseContent(LanguageModel $languageModel, array $file, array &$currentKnowledgeBases): void
    {
        if (!empty($file['parseContent'])) {

            $contents = [];
            foreach ($file['parseContent'] as $content) {
                $contents[] = $content;
//                if ($this->shouldSkipContent($content['content'])) {
//                    continue;
//                }
//
//                $knowledgeBase = KnowledgeBase::where('filename', $file['dir'])
//                    ->where('header', $content['header'])
//                    ->first();
//
//                if ($knowledgeBase) {
//                    $this->updateKnowledgeBase($languageModel, $knowledgeBase, $content);
//                } else {
//                    $this->createKnowledgeBase($languageModel, $file, $content);
//                }
//
//                $this->removeProcessedKnowledgeBase($currentKnowledgeBases, $file['dir'], $content['header']);
            }

            dd($contents);
        }
    }

    /**
     * Determine if the content should be skipped.
     *
     * @param string $content
     * @return bool
     */
    protected function shouldSkipContent(string $content): bool
    {
        return str_contains($content, 'sidebar_position') || str_contains($content, 'Markdown text with');
    }

    /**
     * Update the existing KnowledgeBase.
     *
     * @param LanguageModel $languageModel
     * @param KnowledgeBase $knowledgeBase
     * @param array $content
     * @return void
     */
    protected function updateKnowledgeBase(LanguageModel $languageModel, KnowledgeBase $knowledgeBase, array $content): void
    {
        $md5CurrentContent = md5($content['content']);
        if ($knowledgeBase->md5 !== $md5CurrentContent) {
            $currentContent = $content['header'] . '\n' .$content['content'];
            $knowledgeBase->md5 = $md5CurrentContent;
            $knowledgeBase->parse_content = $currentContent;
            $knowledgeBase->embedded = $this->prepareEmbedded($languageModel, $currentContent);
//            $knowledgeBase->save();
        }
    }

    /**
     * Create a new KnowledgeBase.
     *
     * @param LanguageModel $languageModel
     * @param array $file
     * @param array $content
     * @return void
     */
    protected function createKnowledgeBase(LanguageModel $languageModel, array $file, array $content): void
    {
        $currentContent = $content['header'] . '\n' .$content['content'];
        $knowledgeBase = new KnowledgeBase();
        $knowledgeBase->filename = $file['dir'];
        $knowledgeBase->md5 = md5($content['content']);
        $knowledgeBase->embedded = $this->prepareEmbedded($languageModel, $currentContent);
        $knowledgeBase->header = $content['header'];
        $knowledgeBase->parse_content = $currentContent;
//        $knowledgeBase->save();
    }

    /**
     * Remove the processed KnowledgeBase from the list.
     *
     * @param array $currentKnowledgeBases
     * @param string $filename
     * @param string $header
     * @return void
     */
    protected function removeProcessedKnowledgeBase(array &$currentKnowledgeBases, string $filename, string $header): void
    {
        foreach ($currentKnowledgeBases as $key => $currentKnowledgeBase) {
            if ($currentKnowledgeBase['filename'] === $filename && $currentKnowledgeBase['header'] === $header) {
                unset($currentKnowledgeBases[$key]);
            }
        }
    }

    /**
     * Delete unused DocFiles.
     *
     * @param array $docFiles
     * @return void
     */
    protected function deleteUnusedDocFiles(array $docFiles): void
    {
        foreach ($docFiles as $docFile) {
            $file = DocFile::find($docFile['id']);
            if ($file) {
//                $file->delete();
            }
        }
    }

    /**
     * Delete unused KnowledgeBases.
     *
     * @param array $currentKnowledgeBases
     * @return void
     */
    protected function deleteUnusedKnowledgeBases(array $currentKnowledgeBases): void
    {
        foreach ($currentKnowledgeBases as $knowledgeBase) {
            $file = KnowledgeBase::find($knowledgeBase['id']);
            if ($file) {
//                $file->delete();
            }
        }
    }

    /**
     * Prepare embedded content.
     *
     * @param LanguageModel $languageModel
     * @param string $content
     * @return array
     */
    protected function prepareEmbedded(LanguageModel $languageModel, string $content): array
    {
        return $languageModel->embeddedString($content);
    }

    /**
     * Get the DocFile if it exists.
     *
     * @param string $filename
     * @return DocFile|null
     */
    protected function getDocFileIfExists(string $filename): ?DocFile
    {
        return DocFile::where('filename', $filename)->first();
    }
}
