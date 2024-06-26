# Dokumentacja techniczna AddService

`AbstractAddService` jest abstrakcyjną klasą bazową dla serwisów odpowiedzialnych za dodawanie obiektów do bazy danych. Klasa ta definiuje szereg metod oraz procesów, które mają na celu wspieranie operacji dodawania nowych encji. Dzięki zastosowaniu wzorca projektowego Factory, klasa ta umożliwia tworzenie i zarządzanie cyklem życia encji w sposób zunifikowany i elastyczny.

Konstruktor
```php
public function __construct(
private readonly RepositoryInterface $repository,
private readonly AbstractEntityFactory $entityFactory,
private readonly PersistenceShareMethodsHelper $persistenceShareMethodsHelper,
){}
```
Konstruktor klasy AbstractAddService przyjmuje trzy parametry:

`$repository`: Implementacja interfejsu RepositoryInterface, odpowiedzialna za operacje na bazie danych.

`$entityFactory`: Implementacja AbstractEntityFactory, odpowiedzialna za tworzenie instancji encji.

`$persistenceShareMethodsHelper`: Helper dostarczający metody wspierające procesy związane z trwałością danych.

## Metody
### **__invoke()**
```php
public function __invoke(CommonModifyParams $serviceDto): CommonServiceDTO
```
Główna metoda serwisu, która jest wywoływana podczas dodawania nowej encji. Procesuje dane wejściowe, tworzy nową encję i zarządza jej cyklem życia aż do zapisania jej w bazie danych.

**Przebieg procesu:**
1. Odczyt danych z DTO (**$serviceDto**).
2. Pobranie identyfikatora encji.
3. Weryfikacja istnienia encji w bazie danych.
4. Przygotowanie danych do utworzenia encji.
5. Utworzenie encji w fabryce.
6. Walidacja utworzonej encji.
7. Przygotowanie encji po jej utworzeniu.
8. Wysłanie eventów przed zapisem encji.
9. Walidacja danych przed zapisem.
10. Dodatkowe operacje przed zapisem encji.
11. Zapis encji w bazie danych.
12. Dodatkowe operacje po zapisie encji.
13. Wysłanie eventów po zapisie encji.
14. Zwrócenie wyniku jako DTO.


### **getEntityId()**
```php
protected function getEntityId(array $data): ?string
```
Metoda odpowiedzialna za pobranie identyfikatora encji z danych wejściowych.

### **verifyEntityExists()**
```php
protected function verifyEntityExists(?int $id, string|null $exception = null): void
```
Metoda sprawdzająca, czy encja o podanym ID istnieje w bazie danych. W przypadku istnienia encji rzuca wyjątek.

### **validateDataBeforeSave()**
```php
protected function validateDataBeforeSave(AbstractEntity $entity)
```
Metoda walidująca dane encji przed jej zapisem. Wykorzystuje do tego celu serwis walidacji dostępny w PersistenceShareMethodsHelper.

### **saveEntity()**
```php
protected function saveEntity(AbstractEntity $entity): AbstractEntity
```
Metoda zapisująca encję w bazie danych poprzez repository.

### **dispatchEventsBeforeSave()**
```php
protected function dispatchEventsBeforeSave(AbstractEntity $entity): void
```
Metoda wysyłająca wewnętrzne eventy przed zapisem encji.

### **dispatchEventsAfterSave()**
```php
protected function dispatchEventsAfterSave(AbstractEntity $entity): void
```
Metoda wysyłająca zewnętrzne eventy po zapisie encji.

### **beforeSave()**
```php
protected function beforeSave(AbstractEntity &$entity, ?array &$data): void
```
Metoda umożliwiająca wykonanie dodatkowych czynności przed zapisem encji. Można ją nadpisać w klasach dziedziczących.

### **afterSave()**
```php
protected function afterSave(AbstractEntity &$entity, ?array &$data): void
```
Metoda umożliwiająca wykonanie dodatkowych czynności po zapisie encji. Można ją nadpisać w klasach dziedziczących.

### **prepareDataBeforeCreateEntity()**
```php
protected function prepareDataBeforeCreateEntity(?array &$data): array
```
Metoda przygotowująca dane do utworzenia encji w fabryce. Można ją nadpisać w klasach dziedziczących.

### **prepareEntityAfterCreateEntity()**
```php
protected function prepareEntityAfterCreateEntity(AbstractEntity $entity, ?array &$data): void
```
Metoda umożliwiająca wykonanie dodatkowych czynności po utworzeniu encji w fabryce. Można ją nadpisać w klasach dziedziczących.

Możliwości rozbudowy
AbstractAddService jest klasą abstrakcyjną, co oznacza, że musi być dziedziczona przez klasy konkretne, które implementują specyficzne logiki dla różnych typów encji. Klasy te mogą nadpisywać metody takie jak beforeSave, afterSave, prepareDataBeforeCreateEntity oraz prepareEntityAfterCreateEntity, aby dostosować proces dodawania encji do swoich potrzeb. Pozwala to na dużą elastyczność i możliwość rozbudowy systemu w sposób modularny.


## Przykłady rozbudowy/użycia AddService

### AddClientService

`AddClientService` jest konkretną implementacją abstrakcyjnej klasy AbstractAddService, przeznaczoną do obsługi dodawania klientów do bazy danych. Klasa ta rozszerza możliwości podstawowej klasy, dostosowując proces tworzenia encji klienta poprzez przygotowanie danych wejściowych przed zapisaniem ich do bazy danych.

```php
<?php

declare(strict_types=1);

namespace Wise\Client\Service\Client;

use Wise\Client\Domain\Client\ClientRepositoryInterface;
use Wise\Client\Domain\Client\Factory\ClientFactory;
use Wise\Client\Service\Client\Interfaces\AddClientServiceInterface;
use Wise\Client\Service\Client\Interfaces\ClientGroupHelperInterface;
use Wise\Client\Service\Client\Interfaces\ClientHelperInterface;
use Wise\Core\DataTransformer\CommonDomainDataTransformer;
use Wise\Core\Helper\PersistenceShareMethodsHelper;
use Wise\Core\Service\AbstractAddService;
use Wise\Delivery\Service\DeliveryMethod\Interfaces\DeliveryMethodHelperInterface;
use Wise\Payment\Service\PaymentMethod\Helper\Interfaces\PaymentMethodHelperInterface;
use Wise\Pricing\Service\PriceList\Interfaces\PriceListHelperInterface;
use Wise\User\Service\Trader\Interfaces\TraderHelperInterface;

class AddClientService extends AbstractAddService implements AddClientServiceInterface
{
    public function __construct(
        private readonly ClientRepositoryInterface $repository,
        private readonly ClientFactory $entityFactory,
        private readonly PersistenceShareMethodsHelper $persistenceShareMethodsHelper,
        private readonly PaymentMethodHelperInterface $paymentMethodHelper,
        private readonly DeliveryMethodHelperInterface $deliveryMethodHelper,
        private readonly ClientGroupHelperInterface $clientGroupHelper,
        private readonly TraderHelperInterface $traderHelper,
        private readonly PriceListHelperInterface $priceListHelper,
        private readonly ClientHelperInterface $clientHelper,
    ){
        parent::__construct($repository, $entityFactory, $persistenceShareMethodsHelper);
    }

    /**
     * Umożliwia przygotowanie danych do utworzenia encji w fabryce.
     * @param array|null $data
     * @return array
     */
    protected function prepareDataBeforeCreateEntity(?array &$data): array
    {
        if(!empty($data['defaultPaymentMethodId']) || !empty($data['defaultPaymentMethodIdExternal'])) {
            $data['defaultPaymentMethodId'] = $this->paymentMethodHelper->getIdIfExist(
                id: $data['defaultPaymentMethodId'] ?? null,
                idExternal: $data['defaultPaymentMethodIdExternal'] ?? null
            );

            unset($data['defaultPaymentMethodIdExternal']);
        }

        if(!empty($data['defaultDeliveryMethodId']) || !empty($data['defaultDeliveryMethodIdExternal'])) {
            $data['defaultDeliveryMethodId'] = $this->deliveryMethodHelper->getIdIfExist(
                id: $data['defaultDeliveryMethodId'] ?? null,
                idExternal: $data['defaultDeliveryMethodIdExternal'] ?? null
            );

            unset($data['defaultDeliveryMethodIdExternal']);
        }

        $this->clientGroupHelper->prepareExternalData($data);
        $this->traderHelper->prepareExternalData($data);
        $this->priceListHelper->prepareExternalData($data);
        $this->clientHelper->prepareExternalParentClientData($data);

        // Przygotowanie danych dotyczących statusu
        if (CommonDomainDataTransformer::validateFieldInData($data, 'status')) {
            $data['status'] = $this->clientHelper->getClientStatusIdIfExistsByData($data);
        } else {
            CommonDomainDataTransformer::removeDataForField($data, 'status.');
        }

        return $data;
    }
}
```

Metoda prepareDataBeforeCreateEntity jest nadpisana w celu weryfikacji, czy dane encje istnieją na podstawie wewnętrznego lub zewnętrznego identyfikatora (z zewnętrznych systemów). W tym celu wykorzystane są różne Helpery, które sprawdzają istnienie encji i odpowiednio modyfikują dane wejściowe.

**Dla przykładu:**

`Domyślna metoda płatności` [defaultPaymentMethodId]:
1. Sprawdza czy w danych do zapisu znajduje się identyfikator (wewnętrzny bądź zewnętrzny) metody płatności.
2. Jeśli istnieje defaultPaymentMethodId lub defaultPaymentMethodIdExternal, helper paymentMethodHelper sprawdza istnienie metody płatności.
3. Jeśli metoda istnieje, jej identyfikator jest aktualizowany, a defaultPaymentMethodIdExternal (czyli zewnętrzny identyfikator) jest usuwany z danych.
