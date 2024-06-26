<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'price_net',
        'price_gross',
        'description',
        'category',
        'size',
        'color',
        'material',
        'stock',
        'tags',
        'client_id',
        'image_url'
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return array_merge($this->toArray(),[
            'id' => (string) $this->id,
            'material' => (string) $this->material,
            'tags' => (string) $this->tags,
            'created_at' => $this->created_at->timestamp,
        ]);
    }

    /**
     * Get the name of the index associated with the model.
     */
    public function searchableAs(): string
    {
        return 'products_index';
    }
}
