<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Facade;

use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\EventExecutor;
use App\Core\AssistantMessage\Facade\Interfaces\MessageFacadeInterface;
use App\Core\AssistantMessage\MessageInterpreter\Dto\InterpretationDetails;
use App\Core\AssistantMessage\MessageInterpreter\MessageInterpreter;
use App\Core\AssistantMessage\Service\ConversationService;
use App\Core\AssistantMessage\Service\MessageService;
use App\Core\dd;
use App\Core\Exceptions\EmptyMessageUserException;
use App\Core\Helper\ResponseHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MessageFacade implements MessageFacadeInterface
{
    private ?MessageProcessor $messageProcessor = null;

    public function __construct(
        private readonly MessageInterpreter  $messageInterpreter,
        private readonly EventExecutor       $eventExecutor,
        private readonly ResponseHelper      $responseHelper,
        private readonly ConversationService $conversationService,
        private readonly MessageService      $messageService
    ){}


    public function processAndReturnResponse(): JsonResponse|StreamedResponse
    {
        if ($this->messageProcessor === null || empty($this->messageProcessor->getMessageFromUser())) {
            throw new EmptyMessageUserException('Message from user is empty');
        }

        // Has the task of interpreting and analyzing messages from users. It decides on further actions
        /** @var InterpretationDetails $interpretationDetails */
        $interpretationDetails = $this->messageInterpreter->interpretMessage($this->messageProcessor);
        if($interpretationDetails->isExecuteEvent()){
            // Execute event
            $eventResult = $this->eventExecutor->executeEvent($interpretationDetails, $this->messageProcessor);
        }

        $result = $eventResult ?? $interpretationDetails;

        $responseDto = $this->responseHelper->prepareResponse($this->messageProcessor, $result);
        $responseDto->setType($this->messageProcessor->getType() ?? 'basic');

        return $this->responseHelper->responseStream($responseDto);
    }

    public function loadRequest(Request $request): void
    {
        $messageProcessor = new MessageProcessor();
        $messageProcessor->setMessageFromUser($request->get('message'));
        $messageProcessor->setSessionHash($request->get('session'));
        $messageProcessor->setType($request->get('type'));

        $this->prepareMessages($messageProcessor);
        $this->loadMessageProcessor($messageProcessor);
    }

    public function prepareMessages(MessageProcessor $messageProcessor): void
    {
        $messageProcessor->setMessage($this->messageService->createMessage($messageProcessor, false));
        $messageProcessor->setConversationMessages($this->conversationService->getConversationMessages($messageProcessor->getSessionHash()));
    }

    public function loadMessageProcessor(MessageProcessor $messageProcessor): void
    {
        $messageProcessor->getLoggerStep()->addStep([
            'message' => $messageProcessor->getMessageFromUser(),
        ], 'MessageFacade - loadMessageProcessor');

        $this->prepareMessages($messageProcessor);
        $this->messageProcessor = $messageProcessor;
    }
}
