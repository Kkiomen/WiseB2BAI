<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Adapter\LLM\LanguageModel;
use App\Models\KnowledgeBase;
use Illuminate\Support\Facades\DB;

class KnowledgeService
{
    public function __construct(
        private LanguageModel $languageModel
    )
    {
    }

    /**
     * Get information from the documentations based on the provided question.
     * @param string $question
     * @return string
     */
    public function getInformationFromDocumentations(string $question): string
    {
        $questionEmbedded = $this->languageModel->embeddedString($question);
        $resultKnowledge = $this->getMostSimilarRecords($questionEmbedded, 3);

        return implode("=== Framgent dokumentacji === ", array_map(function ($item) {
            return $item['content'];
        }, $resultKnowledge));
    }

    /**
     * Get the most similar records from the knowledge base based on the provided embedded vector.
     *
     * @param array $questionEmbedded The embedded vector of the question.
     * @param int $topN The number of top similar records to return.
     * @return array The top N similar records with their similarity scores.
     */
    public function getMostSimilarRecords(array $questionEmbedded, int $topN = 5): array
    {
        // Pobierz wszystkie rekordy z bazy danych
        $records = KnowledgeBase::all()->toArray();

        // Przechowuj wyniki podobieństwa
        $similarities = [];

        foreach ($records as $record) {
            $similarity = $this->cosineSimilarity($questionEmbedded, $record['embedded']);
            $similarities[] = ['id' => $record['id'], 'similarity' => $similarity, 'content' => $record['parse_content'], 'header' => $record['header']];
        }


        usort($similarities, function ($a, $b) {
            return $b['similarity'] <=> $a['similarity'];
        });

        // Zwróć top N wyników
        return array_slice($similarities, 0, $topN);
    }

    /**
     * Calculate the cosine similarity between two vectors.
     *
     * @param array $vecA The first vector.
     * @param array $vecB The second vector.
     * @return float The cosine similarity between the two vectors.
     */
    private function cosineSimilarity(array $vecA, array $vecB)
    {
        $dotProduct = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        for ($i = 0; $i < count($vecA); $i++) {
            $dotProduct += $vecA[$i] * $vecB[$i];
            $normA += pow($vecA[$i], 2);
            $normB += pow($vecB[$i], 2);
        }

        return $dotProduct / (sqrt($normA) * sqrt($normB));
    }

}
