<?php

namespace App\Core\Abstract\Collection;


class Collection implements \Iterator
{
    private array $items = [];
    private int $position = 0;

    public function __construct(array $items = [])
    {
        $this->items = $items;
        $this->position = 0;
    }

    public function rewind(): void
    {
        $this->position = 0;
    }

    public function current(): Entity
    {
        return $this->items[$this->position];
    }

    public function key(): int
    {
        return $this->position;
    }

    public function add($item): void
    {
        $this->items[] = $item;
    }

    public function remove($item): void
    {
        $index = array_search($item, $this->items);
        if ($index !== false) {
            unset($this->items[$index]);
            $this->items = array_values($this->items);
        }
    }

    public function next(): void
    {
        ++$this->position;
    }

    public function valid(): bool
    {
        return isset($this->items[$this->position]);
    }
}
