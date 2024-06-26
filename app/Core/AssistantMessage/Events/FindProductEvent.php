<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Events;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\LanguageModelSettings;
use App\Core\Adapter\LLM\LanguageModelType;
use App\Core\AssistantMessage\Dto\MessageProcessor;
use App\Core\AssistantMessage\Events\Core\Abstract\Event;
use App\Core\AssistantMessage\Events\Core\Dto\EventResult;
use App\Core\AssistantMessage\Prompts\PrepareInterpreterSearchProductPrompt;
use App\Models\Product;

class FindProductEvent extends Event
{
    protected ?string $name = 'find_product';
    protected ?string $description = 'Finds products for user. If user ask if we own/sell';

    public function __construct(
        private readonly LanguageModel $languageModel,
    ){}

    public function handle(MessageProcessor $messageProcessor): EventResult
    {
        $products = [];
        $success = false;
        $errors = 0;
        do{
            try{
                // Generate json to search for products
                $searchParams = $this->languageModel->generate(
                    prompt: $messageProcessor->getMessageFromUser(),
                    systemPrompt: PrepareInterpreterSearchProductPrompt::getPrompt(),
                    settings: (new LanguageModelSettings())->setLanguageModelType(LanguageModelType::INTELLIGENT)->setTemperature(0.5)
                );

                $search = json_decode($searchParams, true);


                // Search products
                $searchString = $search['product'] . ', ' . $search['search_tags'];
                $products = Product::search($searchString)->options([
                    'query_by' => 'tags, name'
                ])->get()->toArray();

                $success = true;
            }catch (\Exception $e){
                $errors++;
            }

        }while(!$success);

        $shortInformationAboutProducts = $this->prepareShortInformationAboutProducts($products);

        $result = new EventResult();
        $result
            ->setResultResponseSystemPrompt('You are an assistant who helps users with product selection. Prepare an answer in Polish for the user after searching for the product according to the user recommendation or try with all your might to help with product selection. If you have successfully found products, the user will give you a list of products short details of what was found. Describe briefly what was found. ## Below your answer you will find a list of products found ## If it says ‘empty’ it means that the information could not be found')
            ->setResultResponseUserMessage($shortInformationAboutProducts)
            ->setData($products);

        $messageProcessor->getLoggerStep()->addStep([
            'executeEvent' => true,
            'event' => self::class,
            'resultResponseUserMessage' => $shortInformationAboutProducts,
        ], 'FindProductEvent');

        return $result;
    }



    protected function prepareShortInformationAboutProducts(array $products): string
    {
        if (empty($products)) {
            return 'empty';
        }

        $shortInformation = '';

        foreach ($products as $index => $product) {
            $nameProduct = !empty($product['name']) ? $product['name'] : '';
            $description = !empty($product['description']) ? substr($product['description'], 0, 100) : '';

            if(!empty($nameProduct) || !empty($description)){
                if ($index > 0) {
                    $shortInformation .= ', ';
                }

                if (!empty($nameProduct)) {
                    $shortInformation .= ' - ' . $nameProduct . '' ;
                }

                if (!empty($description)) {
                    $shortInformation .= ': ' . $description;
                }
            }
        }

        return $shortInformation;
    }
}
