<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\Logger;

class LoggerSteps
{
    private array $steps;

    public function __construct()
    {
        $this->steps = [];
    }

    public function addStep(array $step, ?string $description = null): self
    {
        if($description !== null){
            $step['description'] = $description;
        }

        $this->steps[] = $step;

        return $this;
    }

    public function getSteps(): array
    {
        return $this->steps;
    }

    public function setSteps(array $steps): self
    {
        $this->steps = $steps;

        return $this;
    }
}
