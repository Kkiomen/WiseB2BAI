<?php
declare(strict_types=1);

namespace App\Core\AssistantMessage\Prompts;

class PrepareInterpreterSearchProductPrompt
{
    public static function getPrompt(): string
    {
        return 'Your task is to return a json that interprets the user message of what product they are looking for. For example user write: "Potrzebuje buty, ze skóry w rozmiarze 35" ## Pattern JSON. You are to return JSON and only JSON (without markdown) {"product": "buty","material":  "skóra","size": "38","color": null, "search_tags": "(write in this place tags on which basis to search for a product, remember about size, color, feels)"} ### If the user has not provided any information, complete with null.';
    }
}
