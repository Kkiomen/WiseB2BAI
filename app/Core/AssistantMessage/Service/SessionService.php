<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Service;

use App\Models\Conversation;
use Illuminate\Support\Str;

class SessionService
{
    public function generateSession(): string
    {
        do{
            $uuid = (string) Str::uuid();
            $isExistsConversationWithSessionHash = (bool) Conversation::where('session_hash', $uuid)->exists();

        }while($isExistsConversationWithSessionHash);

        return $uuid;
    }
}

/*

{
"index":0,
"delta":{"role":"assistant","content":""},
"finish_reason":null,
"steps":[{"message":"recznik twardy","description":"MessageFacade - loadMessageProcessor"},{"executeEvent":false,"interpreterType":"App\\Core\\AssistantMessage\\MessageInterpreter\\Types\\ProductsInterpreterMessageType","resultResponseUserMessage":"R\u0119cznik - , R\u0119cznik - ",
"data":[{"id":26,"name":"R\u0119cznik","price_net":9.99,"price_gross":10.79,"description":null,"category":null,"size":null,"color":null,"material":null,"image_url":"https:\/\/bhp.pl\/photos\/big\/2112\/0059132112.webp","stock":null,"client_id":null,"tags":"r\u0119cznik twardy","created_at":"2023-11-29T19:52:06.000000Z","updated_at":"2023-11-29T19:52:06.000000Z"},{"id":25,"name":"R\u0119cznik","price_net":73.17,"price_gross":90,"description":null,"category":null,"size":null,"color":null,"material":null,"image_url":"https:\/\/bhp.pl\/photos\/big\/1888\/0064901888.webp","stock":null,"client_id":null,"tags":"r\u0119cznik,r\u0119cznik bawe\u0142na egipska\n,r\u0119cznik gramatura 450 g\/m2\n,r\u0119cznik dobrze ch\u0142on\u0105cy wod\u0119\n,r\u0119cznik mi\u0119kki\n,r\u0119cznik puszysty\n,r\u0119cznik nowoczesny wygl\u0105d\n,r\u0119cznik elegancki wygl\u0105d\n,r\u0119cznik OEKO-TEX Standard 100","created_at":"2023-11-29T19:52:06.000000Z","updated_at":"2023-11-29T19:52:06.000000Z"}],"description":"ProductsInterpreterMessageType"},{"userMessage":"R\u0119cznik - , R\u0119cznik - ",
"systemPrompt":"You are an assistant who helps users with product selection. Prepare an answer in Polish for the user after searching for the product according to the user recommendation. If you have successfully found products, the user will give you a list of products short details of what was found. Describe briefly what was found. ## Below your answer you will find a list of products found ## If it says \u2018empty\u2019 it means that the information could not be found",
"temperature":0.6,
"description":"ResponseHelper - przygotowanie odpowiedzi ko\u0144cowej"}],
"table":[],"type":"basic","data":[]}

 */
