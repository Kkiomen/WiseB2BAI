<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Dto\Logger;

class LoggerSql
{
    private array $queriesSql;

    public function __construct()
    {
        $this->queriesSql = [];
    }

    public function addQuerySql(string $querySql): self
    {
        $this->queriesSql[] = $querySql;

        return $this;
    }

    public function getQueriesSql(): array
    {
        return $this->queriesSql;
    }
}
