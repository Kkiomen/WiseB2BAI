<?php
declare(strict_types=1);

namespace App\Core\Helper;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Dto\Response\AbstractResponseResult;
use App\Core\AssistantMessage\Dto\Response\ResponseDTO;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;
use App\Core\dd;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

final readonly class ResponseHelper
{
    public function __construct(
        private LanguageModel $languageModel
    ){}

    public function prepareResponse(MessageProcessor $messageProcessor, AbstractResponseResult $result): ResponseDto
    {
        $userMessage = $result->getResultResponseUserMessage() ?? $messageProcessor->getMessageFromUser() ?? '';
        $systemPrompt = $result->getResultResponseSystemPrompt() ?? '';
        $temperature = $result->getResultResponseTemperature() ?? 0.6;

        $messageProcessor->getLoggerStep()->addStep([
            'userMessage' => $userMessage,
            'systemPrompt' => $systemPrompt,
            'temperature' => $temperature,
        ], 'ResponseHelper - przygotowanie odpowiedzi końcowej');


        $response = new ResponseDto();
        $response->setUserMessage($userMessage);
        $response->setSystemPrompt($systemPrompt);
        $response->setTemperature($temperature);
        $response->setMessage($messageProcessor->getMessage());
        $response->setLoggerStep($messageProcessor->getLoggerStep());
        $response->setLoggerSql($messageProcessor->getLoggerSql());
        $response->setTable($result->getResultResponseTable());
        $response->setConversationMessages($messageProcessor->getConversationMessages());
        $response->setData($result->getData() ?? null);
        $response->setType($messageProcessor->getType());

        return $response;
    }

    /**
     * Generates a JSON response.
     *
     * @param ResponseDTO|array $response
     * @return JsonResponse
     */
    public function responseJSON(ResponseDTO|array $response): JsonResponse
    {
        if (is_array($response)) {
            return response()->json($response);
        }

        return response()->json([
            'message' => $response->getUserMessage(),
            'prompt' => $response->getSystemPrompt(),
        ]);
    }

    /**
     * Generates a streamed response.
     *
     * @param ResponseDTO $response
     * @return StreamedResponse
     */
    public function responseStream(ResponseDTO $response): StreamedResponse
    {
        $prompt = $response->getUserMessage();
        $systemPrompt = $response->getSystemPrompt();
        $temperature = $response->getTemperature();
        $loggerStep = $response->getLoggerStep();
        $loggerSql = $response->getLoggerSql();
        $table = $response->getTable();
        $messageModel = $response->getMessage();
        $conversation = $response->getConversationMessages();
        $type = $response->getType();
        $data = $response->getData();

        return response()->stream(function () use ($prompt, $systemPrompt, $temperature, $loggerStep, $loggerSql, $table, $messageModel, $conversation, $type, $data) {
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');

            $stream = $this->languageModel->generateStreamWithConversation(
                prompt: $prompt,
                systemPrompt: $systemPrompt,
                settings: (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::NORMAL)->setTemperature($temperature),
                collectionOfMessages: $conversation
            );

            $result = '';
            foreach ($stream as $response) {
                $message = $response->choices[0]->toArray();
                if (!empty($message['delta']['content'])) {
                    $result .= $message['delta']['content'];
                }

                if ($loggerStep !== null) {
                    $message['steps'] = $loggerStep->getSteps();
                }

                $message['table'] = $table ?? null;
                $message['type'] = $type ?? null;
                $message['data'] = $data ?? null;

                $this->sendSseMessage($message, 'message');
            }

            if ($messageModel !== null) {
                $messageModel->result = $result;
                $messageModel->prompt = $prompt;
                $messageModel->steps = json_encode($loggerStep->getSteps());
                $messageModel->queries = json_encode($loggerSql->getQueriesSql());
                $messageModel->system = $systemPrompt;

                $messageModel->save();
            }

        });
    }

    /**
     * Sends a message via Server-Sent Events (SSE).
     * @param $data
     * @param $event
     * @return void
     */
    private function sendSseMessage($data, $event = null): void
    {
        if ($event) {
            echo "event: {$event}\n";
        }
        echo "data: " . json_encode($data) . "\n\n";
        ob_flush();
        flush();
    }
}
