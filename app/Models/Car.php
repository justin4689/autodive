<?php

namespace App\Models;

use App\Enums\BodyType;
use App\Enums\CarCondition;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\Transmission;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'make_id', 'car_model_id', 'year', 'price', 'mileage',
    'fuel_type', 'body_type', 'transmission', 'condition',
    'color', 'description', 'city', 'state', 'country', 'status',
])]
class Car extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'fuel_type'    => FuelType::class,
            'body_type'    => BodyType::class,
            'transmission' => Transmission::class,
            'condition'    => CarCondition::class,
            'status'       => CarStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function make(): BelongsTo
    {
        return $this->belongsTo(Make::class);
    }

    public function carModel(): BelongsTo
    {
        return $this->belongsTo(CarModel::class, 'car_model_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(CarImage::class)->orderBy('order');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(CarImage::class)->where('is_primary', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', CarStatus::Active);
    }
}
