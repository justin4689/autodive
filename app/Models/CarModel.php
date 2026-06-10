<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['make_id', 'name', 'slug'])]
class CarModel extends Model
{
    use HasFactory;

    public function make(): BelongsTo
    {
        return $this->belongsTo(Make::class);
    }

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class, 'car_model_id');
    }
}
