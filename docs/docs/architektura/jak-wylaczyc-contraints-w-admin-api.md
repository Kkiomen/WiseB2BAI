# Jak wyłączyć/usunąć zdalnie Constraints bądź w AdminApi

1. Utwórz nowy walidator i dodaj do services.yaml

```php
###>>> Validators
Vmp\Receiver\Domain\Receiver\Validator\ReceiverRemoveConstraintInAdminApiValidator:
    tags: [ 'wise.validator' ]
```

2.  Stwórz nowy walidator, który będzie odpowiedzialny za usuwanie Constraintsów w zależności od tego czy jesteśmy w AdminApi czy nie.
```php
<?php

declare(strict_types=1);

namespace Vmp\Receiver\Domain\Receiver\Validator;

use Wise\Core\Enum\ControllerScopeEnum;
use Wise\Core\Model\ValidatableInterface;
use Wise\Core\Notifications\NotificationManagerInterface;
use Wise\Core\Service\Validator\ValidatorServiceInterface;
use Wise\Core\Validator\AbstractValidator;
use Wise\Receiver\Domain\Receiver\Receiver;
use Symfony\Component\HttpFoundation\RequestStack;

class ReceiverRemoveConstraintInAdminApiValidator extends AbstractValidator
{
    public function __construct(
        private readonly NotificationManagerInterface $notificationManager,
        private readonly ValidatorServiceInterface $validatorService,
        private readonly RequestStack $requestStack
    )
    {
        parent::__construct($notificationManager);
    }


    /**
     * @param $object
     * @return bool
     * Obsługujemy tym serwisem walidacyjnym wszystkie obiekty typu Receiver
     */
    public function supports($object):bool
    {
        return $object instanceof Receiver;
    }

    /**
     * @param ValidatableInterface $object
     * @return void
     */
    public function validate($object): void
    {
        $request = $this->requestStack->getCurrentRequest();

        if($request->attributes->get('wise_controller_scope')->value === ControllerScopeEnum::ADMIN_API->value){
            $this->validatorService->removeConstraintsByFieldNames([
                'name',
                'email',
                'phone',
                'firstName',
                'firstname',
                'lastName',
                'deliveryAddress.street',
                'deliveryAddress.houseNumber',
                'deliveryAddress.city',
                'deliveryAddress.postalCode',
                'deliveryAddress.countryCode',
            ]);
        }
    }
}
```

Deklarujesz nowy walidator który, posiada DI do ValidatorServiceInterface.

Za usuwanie Constraintsów odpowiada metoda removeConstraintsByFieldNames, która przyjmuje tablicę z nazwami pól, które chcesz usunąć.

Warto sobie zdebugować Validator i zobaczyć jakie Constraintsy są przypisane do danego pola.
