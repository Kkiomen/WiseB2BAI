<?php
declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\File;

class DocumentationService
{

    public function parseAllFiles(): array
    {
        $documentationFiles = $this->getAllFilesInDocs();
        $contents = [];

        foreach ($documentationFiles as $file){

            $dirFile = $file['dir'] . '/' . $file['file'];

            $filePath = base_path('docs/docs'. $dirFile);
            if (File::exists($filePath)) {
                $content = File::get($filePath);

                $parseContent = $this->parseMarkdownContentToDatabaseKnowledgeFormat($content);

                $contents[] = [
                    'dir' => $dirFile,
                    'md5' => md5($content),
                    'parseContent' => $parseContent
                ];
            }
        }

        return $contents;
    }

    /**
     * Returns all files in the docs folder.
     * @return array
     */
    public function getAllFilesInDocs(): array
    {
        $docsPath = base_path('docs/docs');
        $files = scandir($docsPath);

        $elements = [];
        $this->getDocsFile($elements, $files);

        return $elements;
    }

    /**
     * Get all files from the docs folder. (dir and file)
     * @param array $files
     * @param array $dirElements
     * @param string $dir
     * @return void
     */
    public function getDocsFile(array &$files, array $dirElements, string $dir = ''): void
    {
        foreach ($dirElements as $element){
            if(str_contains($element, '.md') || str_contains($element, '.mdx')) {
                $files[] = [
                    'dir' => $dir,
                    'file' => $element
                ];
            }
        }

        $dirs = $this->checkDirs($dirElements);
        if(!empty($dirs)){
            foreach ($dirs as $currentDir){
                if($dir == ''){
                    $dirPath = '/' . $currentDir;
                }else{
                    $dirPath = '/' . $dir . '/' . $currentDir;
                }

                $docsPath = base_path('docs/docs' . $dirPath);
                $dirElements = scandir($docsPath);

                $this->getDocsFile($files, $dirElements, $dirPath);
            }
        }
    }

    /**
     * Check directories in the docs folder.
     * @param array $elementsInDir
     * @return array
     */
    public function checkDirs(array $elementsInDir): array
    {
        $dirs = [];

        foreach ($elementsInDir as $element){
            if(str_contains($element, '.') ){
                continue;
            }

            $dirs[] = $element;
        }

        return $dirs;
    }

    /**
     * Method splits the content of the documentation file into a knowledge base format
     * @param $content
     * @return array
     */
    public function parseMarkdownContentToDatabaseKnowledgeFormat($content): array {
        // Podziel zawartość na linie
        $lines = explode("\n", $content);

        $elements = [];
        $currentHeaders = [];
        $currentContent = '';

        foreach ($lines as $line) {
            // Sprawdź, czy linia jest nagłówkiem
            if (preg_match('/^(#+) (.+)/', $line, $matches)) {
                // Jeśli mamy nagromadzone aktualne treści, dodaj je do elementów
                if ($currentContent !== '') {
                    $elements[] = [
                        'header' => implode(' | ', $currentHeaders),
                        'content' => trim($currentContent)
                    ];
                    $currentContent = '';
                }

                // Zaktualizuj aktualny nagłówek
                $level = strlen($matches[1]); // Długość hashtagu określa poziom nagłówka
                $header = $matches[2];

                // Ustaw lub aktualizuj nagłówki na odpowiednim poziomie
                $currentHeaders = array_slice($currentHeaders, 0, $level - 1);
                $currentHeaders[$level - 1] = $header;
            } else {
                // Dodaj linię do bieżącej zawartości
                $currentContent .= $line . "\n";
            }
        }

        // Dodaj ostatni element, jeśli zawiera treść
        if ($currentContent !== '') {
            $elements[] = [
                'header' => implode(' | ', $currentHeaders),
                'content' => trim($currentContent)
            ];
        }

        return $elements;
    }
}
