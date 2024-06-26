# Jak stworzyć endpoint GET w UiApi

## Utworzenie kontrolera

Na samym początku musimy stworzyć kontroller, który dziedziczy po
UiApiBaseController z pakietu `Wise\Core\ApiUi\Controller\`.

Powień znajdować się w katalogu `Wise\{Moduł}\ApiUi\Controller\{Encja}`
gdzie `"{Moduł}"` to Domena np. Order lub Client a `{Encja}`  dotyczy
konkretnego elementu domeny np OrderPosition.

Dla przykładu stworzy enpoint GET zwracający listę zamówień.

```php
<?php

declare(strict_types=1);

namespace Wise\Order\ApiUi\Controller\Orders;

use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Wise\Core\ApiUi\Controller\UiApiBaseController;
use Wise\Core\Dto\Attribute\CommonGetDtoParamAttributes;
use Wise\Order\ApiUi\Dto\Orders\GetOrdersQueryParametersDto;
use Wise\Order\ApiUi\Service\Orders\Interfaces\GetOrdersServiceInterface;

class GetOrdersController extends UiApiBaseController
{
    public function __construct(
        Security $security,
        private readonly GetOrdersServiceInterface $service
    ) {
        parent::__construct($security);
    }

    #[Route(path: '/', methods: Request::METHOD_GET)]
    #[CommonGetDtoParamAttributes(
        description: 'Lista zmówień. Użyte na liście zamówień w dashboardzie',
        tags: ['Orders'],
        parametersDtoClass: GetOrdersQueryParametersDto::class
    )]
    #[OA\Response(
        response: Response::HTTP_OK,
        description: "Poprawnie pobrano dane",
        content: new OA\JsonContent(ref: "#/components/schemas/GetOrdersResponseDto", type: "object"),
    )]
    #[OA\Response(
        response: Response::HTTP_BAD_REQUEST,
        description: "Wystąpił problem podczas przetwarzania danych",
        content: new OA\JsonContent(ref: "#/components/schemas/FailedResponseDto", type: "object"),
    )]
    public function getAction(Request $request): JsonResponse
    {
        // Parametry ze ścieżki (URL Path) przenoszę do Query Parameters
        foreach ($request->attributes->get('_route_params') as $key => $value) {
            $request->query->add([$key => $value]);
        }

        return $this->service->process($request, GetOrdersQueryParametersDto::class);
    }
}
```

W związku, że tworzymy endpoint GET to nazwa kontrollera musi zaczynać się
od `Get`, następnie podajemy element, który będziemy zwracać czyli `Orders` i na końcu `Controller`.


Jeśli chodzi o konstruktor to zawsze są przekazywane w kontrolerze 2 serwisy.
Security który jest przekazywany z klasy bazowej oraz serwis, który jest odpowiedzialny za przetwarzanie danych.

Nastepnie mamy adnotacje, które są odpowiedzialne za opis endpointu.

`Route` - opisuje ścieżkę oraz metodę HTTP

`CommonGetDtoParamAttributes` - opisuje parametry, które są przekazywane w zapytaniu (dane te są umieszczane w Nelmio)
. `parametersDtoClass` - klasa, która opisuje parametry zapytania czyli informacje, przekazywane w URL np za pomocą parametrów GET

`OA\Response` - opisuje odpowiedzi, które są zwracane przez endpoint. W `content: new OA\JsonContent(ref: ` podajemy klase, która odpowiada za strukturę odpowiedzi.

Przejdźmy do metody `getAction`. W tej metodzie przenosimy parametry ze ścieżki do parametrów zapytania.
i wykonujemy metodę `process` z serwisu, która jest odpowiedzialna za przetworzenie danych. Jako parametr przekazujemy `$request` oraz wcześniej zadeklarowany `QueryParametersDto::class` (ten sam, który podawaliśmy w CommonGetDtoParamAttributes ponieważ deklaruje on paarametry).


## Utworzenie DTO

Musimy zadeklarować dwa DTO jedno dla parametrów zapytania oraz drugie dla odpowiedzi.

### QueryParametersDto - parametry zapytania

QueryParametersDto jest odpowiedzialne za przechowywanie parametrów zapytania, które są przekazywane w URL.
Według architektury tworzymy klasę w katalogu `Wise\{Moduł}\ApiUi\Dto\{Encja}`
Musi ona dziedziczyć po `CommonGetUiApiDto` z pakietu `Wise\Core\ApiUi\Dto`

Nazwa klasy musi zaczynać się od `Get` a następnie nazwa encji, która jest zwracana oraz na końcu `QueryParametersDto`.

```php
<?php

declare(strict_types=1);

namespace Wise\Order\ApiUi\Dto\Orders;

use OpenApi\Attributes as OA;
use Wise\Core\ApiUi\Dto\CommonGetUiApiDto;

class GetOrdersQueryParametersDto extends CommonGetUiApiDto
{
    #[OA\Property(
        description: 'Id użytkownika',
        example: 1,
    )]
    protected int $userOrdering;

    #[OA\Property(
        description: 'Data od /DD-MM-YYYY/',
        example: '01-01-2023',
    )]
    protected string $orderDateFrom;

    #[OA\Property(
        description: 'Data do /DD-MM-YYYY/',
        example: '01-01-2023',
    )]
    protected string $orderDateTo;

    #[OA\Property(
        description: 'Filtrowanie po polach: symbol',
    )]
    protected string $searchKeyword;

    #[OA\Property(
        description: 'Typ i kierunek sortowania',
        example: 'INSERT_ASC, STATUS_DESC',
    )]
    protected string $sortMethod;

    public function getUserOrdering(): int
    {
        return $this->userOrdering;
    }

    public function setUserOrdering(int $userOrdering): self
    {
        $this->userOrdering = $userOrdering;

        return $this;
    }

    ...
}
```

Pamiętaj o getterach i setterach dla każdego z pól.

Zwróć uwagę na adnotacje `OA\Property` które opisują poszczególne pola w DTO.
Te adnotacje są odpowiedzialne za wygenerowanie dokumentacji w Nelmio.
Zawierają one opis pola oraz przykładowe wartości (zawsze je uzupełniaj aby innym było łatwiej).
Pamiętaj aby zadeklarować klasę w kontrolerze

### ResponseDto - odpowiedź

CommonResponseDto jest odpowiedzialne za przechowywanie odpowiedzi z endpointu.
Według architektury tworzymy klasę w katalogu `Wise\{Moduł}\ApiUi\Dto\{Encja}`
Musi ona dziedziczyć po `AbstractResponseDto` z pakietu `Wise\Core\Dto`

Nazwa klasy musi zaczynać się od `Get` a następnie nazwa encji, która jest zwracana oraz na końcu `ResponseDto`.

Na początku tworzymy pierwszy response reprezentujący zwracane dane z endpointu.
Zwróć uwagę na `/** @var GetOrderResponseDto[] */` - jest to tablica obiektów, które są zwracane.
To właśnie w `GetOrderResponseDto` deklarujemy wygląd pojedynczego obiektu.

```php
declare(strict_types=1);

namespace Wise\Order\ApiUi\Dto\Orders;

use Wise\Core\Dto\AbstractResponseDto;

class GetOrdersResponseDto extends AbstractResponseDto
{
    /** @var GetOrderResponseDto[] */
    protected ?array $items;

    public function getItems(): ?array
    {
        return $this->items;
    }

    public function setItems(?array $items): self
    {
        $this->items = $items;
        return $this;
    }
}

```

Następnie tworzymy DTO, które opisuje pojedynczy obiekt.

```php
namespace Wise\Order\ApiUi\Dto\Orders;

use OpenApi\Attributes as OA;
use Wise\Core\Model\Address;

class GetOrderResponseDto extends AbstractResponseDto
{

    #[OA\Property(
        description: 'ID zamówienia nadawane przez system ERP',
        example: 'ORDER-123',
    )]
    protected int $id;

    #[OA\Property(
        description: 'Aktualny status realizacji zamówienia',
        example: 1,
    )]
    protected ?int $status;


    #[OA\Property(
        description: 'Adres klienta w momencie składania zamówienia'
    )]
    protected ?Address $clientAddress;

    ...
}
```

Pamiętaj o getterach i setterach.
Zwróć uwagę, że możemy przekazać też obiekt w DTO, w tym przypadku jest to `Address`.

---

Jak już mamy zadeklarowane DTO dla response musimy zrobić dwie rzeczy

1. Zadeklarować w nelmio w `config/packages/nelmio_api_doc.yaml` w sekcji `models` nasze DTO

```yaml
- { alias: GetOrdersResponseDto, type: Wise\Order\ApiUi\Dto\Orders\GetOrdersResponseDto, areas: [ 'api_ui_v2' ] }
```

2. Teraz alias deklarujemy w kontrolerze w sekcji `#[OA\Response]` w `content: new OA\JsonContent(ref: "#/components/schemas/GetOrdersResponseDto", type: "object")`


## Utworzenie serwisu - GET UiApi

Według architektury tworzymy klasę w katalogu `Wise\{Moduł}\ApiUi\Service\{Encja}`
Musi ona dziedziczyć po `AbstractGetService` z pakietu `Wise\Core\ApiUi\Service`

```php
declare(strict_types=1);

namespace Wise\Order\ApiUi\Service\Orders;

use Wise\Core\ApiUi\Helper\UiApiShareMethodsHelper;
use Wise\Core\ApiUi\Service\AbstractGetService;
use Wise\Core\Service\CommonListParams;
use Wise\Order\ApiUi\Dto\Orders\GetOrderResponseDto;
use Wise\Order\ApiUi\Service\Orders\Interfaces\GetOrdersServiceInterface;
use Wise\Order\Service\Order\Interfaces\ListOrdersForCurrentUserServiceInterface;

/**
 * Serwis api - pobierający listę zamówień w zależności od zalogowanego użytkownika
 */
class GetOrdersService extends AbstractGetService implements GetOrdersServiceInterface
{
    protected const SERVICE_PARAMS_DTO = CommonListParams::class;
    protected const RESPONSE_DTO = GetOrderResponseDto::class;

    public function __construct(
        UiApiShareMethodsHelper $shareMethodsHelper,
        private readonly ListOrdersForCurrentUserServiceInterface $listOrdersForCurrentUserService,
    ) {
        parent::__construct($shareMethodsHelper, $listOrdersForCurrentUserService);
    }
}
```


Oraz deklarujemy interfejs

Według architektury tworzymy interfejs w katalogu `Wise\{Moduł}\ApiUi\Service\{Encja}\Interfaces`
Musi ona dziedziczyć po `ApiUiGetServiceInterface` z pakietu `Wise\Core\ApiUi\ServiceInterface`

```php
declare(strict_types=1);

namespace Wise\Order\ApiUi\Service\Orders\Interfaces;

use Wise\Core\ApiUi\ServiceInterface\ApiUiGetServiceInterface;

interface GetOrdersServiceInterface extends ApiUiGetServiceInterface
{
}
```


Na co zwrócić uwagę w serwisie:
- `SERVICE_PARAMS_DTO` - klasa, która opisuje parametry do zapytania
- `RESPONSE_DTO` - klasa, która opisuje odpowiedź z zapytania (zwróć uwagę, że jest to DTO pojedyńczego elementu, a nie listy)
  Oba powyższe pola są wymagane w klasie bazowej `AbstractGetService`

W konstruktorze przekazujemy serwis, który jest odpowiedzialny za pobranie danych. W tym przypadku jest to `ListOrdersForCurrentUserServiceInterface`
`UiApiShareMethodsHelper` - serwis, który zawiera metody pomocnicze, które są wspólne dla wszystkich serwisów. (w rzeczywistości pozwala wstrzykiwać dodatkowe klasy będ edycji wszystkich endpointów w przyszłości)

### Filtrowanie
W związku z tym, że zadeklarowaliśmy parametry po których chcemy filtrować dane, musimy zaimplementować metodę `customInterpreterParameters` w serwisie.
Pozwala ona na customową obsługę filtrów z parametrów zapytania (`QueryParametersDto`) - zwróć uwagę, że field odpowiada nazwą pól w `QueryParametersDto`.

```php
/**
 * Metoda w serwisie UiApi
 * Customowa obsługa przygotowania filtrów dla serwisu z parametru
 */
protected function customInterpreterParameters(array &$filters, int|string $field, mixed $value): bool
{
    /**
     * Tworzymy filtr typu większy niż: sysInsertDate > value
     */
    if ($field === 'orderDateFrom') {
        $filters[] = new QueryFilter('sysInsertDate', new DateTime($value), QueryFilter::COMPARATOR_GREATER_THAN);
        return true;
    }

    /**
     * Tworzymy filtr typu mniejszy niż: sysInsertDate < value
     */
    if ($field === 'orderDateTo') {
        $filters[] = new QueryFilter('sysInsertDate', new DateTime($value), QueryFilter::COMPARATOR_LESS_THAN);
        return true;
    }

    return false;
}
```

`QueryFilter` - jest klasą, która opisuje filtr, który jest przekazywany do serwisu, zawiera ona pole, wartość oraz typ porównania.
Jako pierwszy parametr przyjmuje nazwę pola, które chcemy filtrować, drugi parametr to wartość, a trzeci to typ porównania (domyślnie `=`).

### Mapowanie pól z DTO na encję
Jeśli nazwy pól w `ResponseDto` nie odpowiadają nazwom pól w encji możemy je zmapować za pomocą metody `prepareCustomFieldMapping` w serwisie.

```php
/**
 * Metoda w serwisie UiApi
 * Customowe mapowanie pól z DTO na encję
 */
protected function prepareCustomFieldMapping(array $fieldMapping = []): array
{
    // DTO field => Entity field

    return [
        'userOrdering' => 'userId',
    ];
}
```

---
Kolejny przykład zastosowania `prepareCustomFieldMapping` to mapowanie pól z DTO na pole które pochodzi z innej encji (JOIN).
Przypominam że po lewej stronie wstawiamy pole z ResponseDto a po prawej pole z encji. Jeśli chcemy zmapować pole z innej encji musimy przekazać informacje w pewnej strukturze `{encja}Id.{pole}`
Czyli w tym przypadku mówię, że dla pola `productId` w DTO ma być pobierane pole `id` z encji `Product` (jeśli brakuje Joinów może je dodać w serwisie ListService dla danej encji).

```php
/**
 * Metoda w serwisie UiApi
 * Customowe mapowanie pól z DTO na encję
 */
protected function prepareCustomFieldMapping(array $fieldMapping = []): array
{
    // DTO field => Entity field

    return [
        'productId' => 'productId.id',
    ];
}
```


### Zmodyifikowanie wyniku przed transformacją do ResponseDto

Serwisy zawsze zwracają wynik w postaci tablicy, następnie są deserializowane do ResponseDto.
Jeśli z różnych powodów potrzebujemy zmodyfikować wynik bo np. pole jest wymagane w ResponseDto (a nie chcemy aby wyrzucił wyjątku [deserializator] bo brakuje jakiś danych) możemy to zrobić za pomocą metody `prepareServiceDtoBeforeTransform` w serwisie.

Przykład:
```php
/**
 * Metoda pozwala przekształcić serviceDto przed transformacją do responseDto
 * @param array|null $serviceDtoData
 * @return void
 */
protected function prepareServiceDtoBeforeTransform(?array &$serviceDtoData): void
{
    foreach ($serviceDtoData as &$order){
        $order['clientFullName'] = $order['clientFirstName'] . ' ' . $order['clientLastName'];
    }
}
```

### Sortowanie po polach
Może być wymagane, aby wprowadzić sortowanie po polach (bo np w tabeli są strzałki określający kierunek sortowania).

W tym celu musimy:
1. Zadeklarować w Dto `QueryParametersDto` pole, które będzie przechowywać informacje o sortowaniu (musi się nazywać `sortMethod`). Pamiętaj o Getterze i Setterze.
```php
#[OA\Property(
    description: 'Typ i kierunek sortowania',
    example: 'INSERT_ASC, STATUS_DESC',
)]
protected string $sortMethod;
```

2. W metodzie, która dziedziczy po `AbstractGetService` należy przeciążyć metodę `prepareSortFieldMapping` . Zadaniem tej metody jest mapowanie kluczy z query do pól encji
```php
/**
 * Metoda służąca do mapowania pól sortowania,
 * Jeśli chcemy sortować po konkretnych polach w tym miejscu możemy zmapować nazwy pól domeny z tymi przekazywanymi z Query
 * @param string $fieldName
 * @return string
 */
protected function prepareSortFieldMapping(string $fieldName): string
{
    // DTO field => Entity field
    return match ($fieldName) {
        'insert' => 'sysInsertDate',
        'status' => 'status',
        default => 'default',
    };
}
```

Zwróć uwagę na przykład `INSERT_ASC`. `INSERT` to pole, po którym chcemy sortować, a `ASC` to kierunek sortowania (może być `DESC`). Nazwy pól muszą być oddzielone podłogą.
za pomocą `prepareSortFieldMapping` mówimy jak lewą część czyl `INSERT` ma mapować na pole w encji.


### Przygotowanie danych wynikowych

Jeśli chcemy przygotować dane wynikowe przed zwróceniem ich w odpowiedzi możemy to zrobić za pomocą metody `fillResponseDto` w serwisie.
W momencie kiedy dane są już zdeserializowane możemy zmodyfikować je przed zwróceniem. Za pomocą metody `fillResponseDto` możemy dodać dodatkowe informacje do odpowiedzi pojedyńczego obiektu.
W poniższym przypadku dodajemy nazwę użytkownika, status zamówienia oraz dane dostawy. Możemy to wykorzystać m.in. w sytuacji, kiedy deklarujemy Obiekt w konkretnym polu ResponseDto, to pole nie znajduje się w encji.

```php
 /**
 * Metoda pozwala uzupełnić responseDto o dodatkowe informacje
 * @param AbstractDto $responseDtoItem
 * @return void
 */
protected function fillResponseDto(AbstractDto $responseDtoItem, array $cacheData, ?array $serviceDtoItem = null): void
{
    $this->fillUserName($responseDtoItem);
    $this->fillOrderStatus($responseDtoItem);
    $this->fillDelivery($responseDtoItem, $serviceDtoItem);
}

...

/**
 * Metoda uzupełnia pole status
 * @param OrdersResponseDto $resultDto
 * @return void
 */
protected function fillOrderStatus(OrdersResponseDto|AbstractDto $resultDto): void
{
    $link = $_ENV['APP_CHANNEL'] . '://';
    $link .= $_ENV['API_TRUSTED_HOST'] . ':';
    $link .= $_ENV['WEB_PORT'] . '/';

    // Pobieramy informacje o statusie zamówienia
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
```

