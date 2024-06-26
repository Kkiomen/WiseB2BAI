<?php

namespace App\Console\Commands;

use App\Core\Adapter\LLM\LanguageModel;
use App\Models\DocFile;
use App\Models\KnowledgeBase;
use App\Services\DocumentationService;
use Illuminate\Console\Command;

class GenerateDocumentation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-documentation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @param DocumentationService $documentationService
     * @param LanguageModel $languageModel
     * @return void
     */
    public function handle(DocumentationService $documentationService, LanguageModel $languageModel): void
    {
        $preparedDocumentationFiles = $documentationService->parseAllFiles();
        $currentKnowledgeBases = KnowledgeBase::all()->toArray();
        $docFiles = DocFile::all()->toArray();

        $this->output->progressStart($this->countParseContent($preparedDocumentationFiles));

        $this->processDocumentationFiles($languageModel, $preparedDocumentationFiles, $currentKnowledgeBases, $docFiles);
        $this->deleteUnusedDocFiles($docFiles);
        $this->deleteUnusedKnowledgeBases($currentKnowledgeBases);

        $this->output->progressFinish();
    }

    /**
     * Count the parse content.
     * @param array $preparedDocumentationFiles
     * @return int
     */
    protected function countParseContent(array $preparedDocumentationFiles): int
    {
        $count = 0;
        foreach ($preparedDocumentationFiles as $file) {
            $count += count($file['parseContent']);
        }

        return $count;
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
            foreach ($file['parseContent'] as $content) {
                if ($this->shouldSkipContent($content['content'], $content['header'])) {
                    continue;
                }

                $knowledgeBase = KnowledgeBase::where('filename', $file['dir'])
                    ->where('header', $content['header'])
                    ->first();

                if ($knowledgeBase) {
                    $this->updateKnowledgeBase($languageModel, $knowledgeBase, $content);
                } else {
                    $this->createKnowledgeBase($languageModel, $file, $content);
                }

                $this->removeProcessedKnowledgeBase($currentKnowledgeBases, $file['dir'], $content['header']);

                $this->output->progressAdvance();
            }
        }
    }

    /**
     * Determine if the content should be skipped.
     *
     * @param string $content
     * @param string $header
     * @return bool
     */
    protected function shouldSkipContent(string $content, string $header): bool
    {
        if(strlen($content) <= strlen($header) + 50) {
            return true;
        }

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
            $knowledgeBase->parse_content = $this->prepareContentForPrompt($currentContent);
            $knowledgeBase->header = $this->prepareHeader($content['header']);
            $knowledgeBase->embedded = $this->prepareEmbedded($languageModel, $currentContent);
            $knowledgeBase->save();
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
        $knowledgeBase->header = $this->prepareHeader($content['header']);
        $knowledgeBase->parse_content = $this->prepareContentForPrompt($currentContent);
        $knowledgeBase->save();
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
                $file->delete();
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
                $file->delete();
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

//        return  [0,0,0,0];
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

    /**
     * Prepare the header.
     * @param string $header
     * @return string
     */
    protected function prepareHeader(string $header): string
    {
        $maxLength = 244;

        if (strlen($header) > $maxLength) {
            $header = substr($header, -$maxLength);
        }

        return $header;
    }

    /**
     * Prepare the content for the prompt.
     * @param string $content
     * @param int $maxLength
     * @return string
     */
    function prepareContentForPrompt(string $content, int $maxLength = 4000): string {
        // Usuń nadmiarowe spacje i entery
        $content = preg_replace('/\s+/', ' ', $content);
        $content = trim($content);

        // Skróć string do zadanej długości, nie usuwając ważnej zawartości
        if (strlen($content) > $maxLength) {
            $content = substr($content, 0, $maxLength);

            // Znajdź ostatnie wystąpienie pełnego zdania, aby nie przerwać treści
            $lastSentenceEnd = max(strrpos($content, '.'), strrpos($content, '!'), strrpos($content, '?'));
            if ($lastSentenceEnd !== false) {
                $content = substr($content, 0, $lastSentenceEnd + 1);
            } else {
                // Jeśli nie znaleziono końca zdania, ucinamy w najbliższym sensownym miejscu
                $content = substr($content, 0, strrpos($content, ' ')) . '...';
            }
        }

        return $content;
    }
}
