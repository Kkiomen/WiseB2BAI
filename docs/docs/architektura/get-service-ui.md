# Dokumentacja techniczna AbstractGetService

`AbstractGetService` to abstrakcyjna klasa w UiAPI , która jest używana jako baza dla wszystkich endpointów GET w API UI (zwracanie wielu elementów). Klasa ta pełni rolę serwisu prezentacji, co oznacza, że jej zadaniem jest jedynie pośredniczenie między kontrolerem a logiką aplikacyjną. Nie powinna wykonywać żadnej logiki biznesowej. Może jedynie przygotowywać dane do zwrócenia.

## Metody

### __invoke()
```php
public function __construct( 
	protected readonly UiApiShareMethodsHelper $shareMethodsHelper, 
	private readonly ApplicationServiceInterface|AbstractForCurrentUserService|AbstractListService|null $service = null 
){}
```
Parametry:

-   **$shareMethodsHelper** _(UiApiShareMethodsHelper)_: Obiekt pomocniczy do obsługi wspólnych metod. Umożliwia nam wstrzyknięcie dodatkowych obiektów we wszystkich klasach bez edycji każdego z serwisów
-   **$service** _(ApplicationServiceInterface|AbstractForCurrentUserService|AbstractListService|null)_: Serwis aplikacyjny odpowiedzialny za logikę biznesową.

### process()
Metoda `process()` obsługuje zapytanie HTTP GET, przetwarza parametry, wywołuje odpowiedni serwis i zwraca wynik w formie JSON.
```php
final public function process(Request $request, string $dtoClass): JsonResponse
```

Przykład użycia:
```php
public function getAction(Request $request): JsonResponse  
{  
	// Parametry ze ścieżki (URL Path) przenoszę do Query Parameters  
	foreach ($request->attributes->get('_route_params') as $key => $value) {  
        $request->query->add([$key => $value]);  
    }  
  
    return $this->getOrderService->process(  
        $request,  
        GetOrderQueryParametersDto::class  
  );  
}
```


### get()
Metoda `get` jest centralnym punktem przetwarzania zapytań GET. Jest odpowiedzialna za interpretację parametrów, wywołanie odpowiedniego serwisu aplikacyjnego oraz przygotowanie odpowiedzi w formie DTO.

```php
public function get(InputBag $parameters): array
```

### customInterpreterParameters()
Metoda pozwala na dodanie własnych filtrów do listy filtrów.

```php
protected function customInterpreterParameters(array &$filters, int|string $field, mixed $value): bool
```

Przykład użycia:
```php
protected function customInterpreterParameters(array &$filters, int|string $field, mixed $value): bool 
{ 
	if ($field === 'isPaid') { 
		$filters[] = new QueryFilter('isPaid', $value); 
		return true; 
	} 

	return false; 
}
```
Pozwala zrobić dedykowane filtry dla parametrów GET, które zostały przekazane w zapytaniu
`http://wiseb2b.local/ui-api/orders?isPaid=true`


### prepareCustomFieldMapping()
Metoda definiuje mapowanie pól z Response DTO, których nazwy nie są zgodne z domeną i wymagają mapowania.
```php
protected function prepareCustomFieldMapping(array $fieldMapping = []): array
```
Przykład użycia:

```php
protected function prepareCustomFieldMapping(array $fieldMapping = []): array 
{ 
	return [ 
		'responseField' => 'entityField', 
		'anotherResponseField' => 'anotherEntityField', 
	]; 
}
```

### fillParams()
Metoda umożliwia o dodatkowe uzupełnienie parametrów zanim zostaną przekazane do serwisu
```php
protected function fillParams(CommonListParams $commonListParams): void
```
Przykład użycia:

```php
protected function fillParams(CommonListParams $commonListParams): void 
{ 
	parent::fillParams($commonListParams); 
	$commonListParams->setCustomParam($this->temporaryData['customParam'] ?? null); 
}
```


### prepareSortFieldMapping()
Metoda służąca do mapowania pól sortowania,  
Jeśli chcemy sortować po konkretnych polach w tym miejscu możemy zmapować nazwy pól domeny z tymi przekazywanymi z Query

```php
protected function prepareSortFieldMapping(string $fieldName): string
```

Przykład użycia:
```php
protected function prepareSortFieldMapping(string $fieldName): string 
{ 
	return match ($fieldName) { 
		'createDate' => 'sysInsertDate', 
		'status' => 'status', 
		default => 'default', 
	}; 
}
```


### fillResponseDto()
Metoda pozwala na uzupełnienie odpowiedzi DTO o dodatkowe informacje.
```php
protected function fillResponseDto(AbstractDto $responseDtoItem, array $cacheData, ?array $serviceDtoItem = null): void
```

Przykład użycia:
```php
protected function fillResponseDto(AbstractDto $responseDtoItem, array $cacheData, ?array $serviceDtoItem = null): void 
{ 
	$this->fillUserName($responseDtoItem); 
	$this->fillOrderStatus($responseDtoItem); 
}
```

### prepareCacheData()
Metoda przygotowuje dane do cache, wykorzystywane do uzupełnienia DTO.
Pozwala zaciągnąć dla wszystkich elementów response dodatkowe informacje `za pomocą jednej SQL`.



## Przykładowa klasa dziedzicząca

```php
<?php

declare(strict_types=1);

namespace Wise\Order\ApiUi\Service\Orders;

use DateTime;
use Symfony\Contracts\Translation\TranslatorInterface;
use Wise\Core\ApiUi\Helper\UiApiShareMethodsHelper;
use Wise\Core\ApiUi\Service\AbstractGetService;
use Wise\Core\Dto\AbstractDto;
use Wise\Core\Model\QueryFilter;
use Wise\Core\Service\CommonListParams;
use Wise\Order\ApiUi\Dto\Orders\DeliveryDto;
use Wise\Order.ApiUi\Dto\Orders\Model\StatusDto;
use Wise\Order.ApiUi\Dto\Orders\OrdersResponseDto;
use Wise\Order\ApiUi\Service\Orders\Interfaces\GetOrdersServiceInterface;
use Wise\Order.Domain\OrderStatus\OrderStatusServiceInterface;
use Wise\Order\Service\Order\Interfaces\ListOrdersForCurrentUserServiceInterface;
use Wise\Order\Service\Order\ListOrdersForCurrentUserParams;
use Wise\User\Domain\User\UserServiceInterface;

class GetOrdersService extends AbstractGetService implements GetOrdersServiceInterface
{
    protected const SERVICE_PARAMS_DTO = ListOrdersForCurrentUserParams::class;
    protected const RESPONSE_DTO = OrdersResponseDto::class;

    public function __construct(
        UiApiShareMethodsHelper $shareMethodsHelper,
        private readonly ListOrdersForCurrentUserServiceInterface $service,
        private readonly UserServiceInterface $userService,
        private readonly TranslatorInterface $translator,
        private readonly OrderStatusServiceInterface $orderStatusService,
    ) {
        parent::__construct($shareMethodsHelper, $service);
    }

    protected function customInterpreterParameters(array &$filters, int|string $field, mixed $value): bool
    {
        if ($field === 'userOrdering') {
            $this->temporaryData['userId'] = (int)$value;
            return true;
        }
        if ($field === 'orderDateFrom') {
            $filters[] = new QueryFilter('sysInsertDate', new DateTime($value), QueryFilter::COMPARATOR_GREATER_THAN);
            return true;
        }
        if ($field === 'orderDateTo') {
            $filters[] = new QueryFilter('sysInsertDate', new DateTime($value), QueryFilter::COMPARATOR_LESS_THAN);
            return true;
        }
        return false;
    }

    protected function prepareCustomFieldMapping(array $fieldMapping = []): array
    {
        return [
            'id' => 'id',
            'createDate' => 'sysInsertDate',
            'statusId' => 'status',
            'firstName' => 'userId.firstName',
            'lastName' => 'userId.lastName',
            'paymentMethodInternalId' => 'paymentMethodId',
            'deliveryMethodInternalId' => 'deliveryMethodId',
            'receiverAddress' => 'receiverAddress',
            'receiverDeliveryPoint' => 'receiverDeliveryPoint',
            'manualCashOnDeliveryValue' => 'manualCashOnDeliveryValue',
            'positionsValueNet' => 'positionsValueNet',
            'positionsValueGross' => 'positionsValueGross',
            'servicesValueNet' => 'servicesValueNet',
            'servicesValueGross' => 'servicesValueGross',
            'shippingValueNet' =>  'shippingValueNet',
            'shippingValueGross' => 'shippingValueGross',
            'paymentValueNet' => 'paymentValueNet',
            'paymentValueGross' => 'paymentValueGross',
            'dropshipping' => 'dropshipping',
            'isBlocked' => 'isBlocked',
            'delivery' => 'delivery',
        ];
    }

    protected function fillParams(CommonListParams $commonListParams): void
    {
        parent::fillParams($commonListParams);
        $commonListParams->setUserId($this->temporaryData['userId'] ?? null);
    }

    protected function prepareServiceDtoBeforeTransform(?array &$serviceDtoData): void
    {
        foreach ($serviceDtoData as &$order){
            if(isset($order['receiverDeliveryPoint']) && is_array($order['receiverDeliveryPoint'])){
                if(isset($order['receiverDeliveryPoint']['address']) && is_array($order['receiverDeliveryPoint']['address'])){
                    $order['receiverDeliveryPoint']['address']['building'] = $order['receiverDeliveryPoint']['address']['houseNumber'];
                    unset($order['receiverDeliveryPoint']['address']['houseNumber']);
                    $order['receiverDeliveryPoint']['address']['apartment'] = $order['receiverDeliveryPoint']['address']['apartmentNumber'];
                    unset($order['receiverDeliveryPoint']['address']['apartmentNumber']);
                }
            }
        }
    }

    protected function fillResponseDto(AbstractDto $responseDtoItem, array $cacheData, ?array $serviceDtoItem = null): void
    {
        $this->fillUserName($responseDtoItem);
        $this->fillOrderStatus($responseDtoItem);
        $this->fillDelivery($responseDtoItem, $serviceDtoItem);
    }

    protected function fillUserName(OrdersResponseDto|AbstractDto $resultDto): void
    {
        $resultDto->setUserName(
            $this->userService->getName(
                $resultDto->getFirstName(),
                $resultDto->getLastName()
            )
        );
    }

    protected function fillOrderStatus(OrdersResponseDto|AbstractDto $resultDto): void
    {
        $link = $_ENV['APP_CHANNEL'] . '://';
        $link .= $_ENV['API_TRUSTED_HOST'] . ':';
        $link .= $_ENV['WEB_PORT'] . '/';
        $orderStatus = $this->orderStatusService->getOrderStatusByStatusNumber($resultDto->getStatusId());

        $statusDto = new StatusDto();

        if($orderStatus !== null) {
            $statusDto->setColor(
                color: $this->translator->trans('order_status.'.strtolower($orderStatus?->getStatus()).'.color')
            );
            $statusDto->setLabel(
                label: $this->translator->trans('order_status.'.strtolower($orderStatus?->getStatus()).'.label')
            );
            $statusDto->setIcon(
                icon: $this->translator->trans('order_status.'.strtolower($orderStatus?->getStatus()).'.icon', ['{link}' => $link])
            );
        }

        $resultDto->setStatus($statusDto);
    }

    protected function prepareSortFieldMapping(string $fieldName): string
    {
        return match ($fieldName) {
            'createDate' => 'sysInsertDate',
            'status' => 'status',
            default => 'default',
        };
    }

    protected function fillDelivery(AbstractDto $responseDtoItem, ?array $serviceDtoItem)
    {
        if(empty($serviceDtoItem['delivery'])){
            return;
        }

        $result = null;

        foreach ($serviceDtoItem['delivery'] as $currentDelivery){
            $statusFormatted = '-';
            if(!empty($currentDelivery['status'])){
                $status = $currentDelivery['status'];
                $keyTranslation = 'delivery.status.'.$status;
                $statusFormatted = $this->translator->trans($keyTranslation) != $keyTranslation ? $this->translator->trans($keyTranslation) : $status;
            }

            $deliveryDto = new DeliveryDto();
            $deliveryDto
                ->setStatus($currentDelivery['status'] ?? null)
                ->setTrackingNumber($currentDelivery['trackingNumber'] ?? null)
                ->setShippingDate($currentDelivery['shippingDate'] ?? null)
                ->setDeliveryDate($currentDelivery['deliveryDate'] ?? null)
                ->setStatusFormatted($statusFormatted)
                ->setDeliveryMethodId($currentDelivery['deliveryMethodId'] ?? null)
                ->setDeliveryMethodName($currentDelivery['deliveryMethodName'] ?? null)
                ->setDeliveryMethodIconImageUrl($currentDelivery['deliveryMethodIconImageUrl'] ?? null);

            $result[] = $deliveryDto;
        }

        $responseDtoItem->setDelivery($result);
    }
}


```
