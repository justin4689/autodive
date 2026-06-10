<?php

namespace App\Services;

use App\Enums\BodyType;
use App\Enums\FuelType;
use App\Enums\Transmission;
use App\Models\Car;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class CarSearchService
{
    private const PER_PAGE = 12;

    public function search(array $filters): LengthAwarePaginator
    {
        return Car::active()
            ->with(['make', 'carModel', 'primaryImage'])
            ->when($filters['make_id'] ?? null, fn (Builder $q, $v) => $q->where('make_id', $v))
            ->when($filters['car_model_id'] ?? null, fn (Builder $q, $v) => $q->where('car_model_id', $v))
            ->when($filters['year_min'] ?? null, fn (Builder $q, $v) => $q->where('year', '>=', $v))
            ->when($filters['year_max'] ?? null, fn (Builder $q, $v) => $q->where('year', '<=', $v))
            ->when($filters['price_min'] ?? null, fn (Builder $q, $v) => $q->where('price', '>=', $v))
            ->when($filters['price_max'] ?? null, fn (Builder $q, $v) => $q->where('price', '<=', $v))
            ->when($filters['mileage_max'] ?? null, fn (Builder $q, $v) => $q->where('mileage', '<=', $v))
            ->when($filters['fuel_type'] ?? null, fn (Builder $q, $v) => $q->where('fuel_type', $v))
            ->when($filters['body_type'] ?? null, fn (Builder $q, $v) => $q->where('body_type', $v))
            ->when($filters['transmission'] ?? null, fn (Builder $q, $v) => $q->where('transmission', $v))
            ->when($filters['condition'] ?? null, fn (Builder $q, $v) => $q->where('condition', $v))
            ->when($filters['city'] ?? null, fn (Builder $q, $v) => $q->where('city', 'like', "%{$v}%"))
            ->when($filters['state'] ?? null, fn (Builder $q, $v) => $q->where('state', $v))
            ->orderBy($this->sortColumn($filters['sort'] ?? null), $this->sortDirection($filters['sort'] ?? null))
            ->paginate(self::PER_PAGE)
            ->withQueryString();
    }

    public function filterOptions(): array
    {
        $map = fn($e) => ['value' => $e->value, 'label' => $e->label()];

        return [
            'fuel_types'    => array_map($map, FuelType::cases()),
            'body_types'    => array_map($map, BodyType::cases()),
            'transmissions' => array_map($map, Transmission::cases()),
        ];
    }

    private function sortColumn(?string $sort): string
    {
        return match ($sort) {
            'price_asc', 'price_desc' => 'price',
            'year_desc', 'year_asc'   => 'year',
            'mileage_asc'             => 'mileage',
            default                   => 'created_at',
        };
    }

    private function sortDirection(?string $sort): string
    {
        return match ($sort) {
            'price_asc', 'year_asc', 'mileage_asc' => 'asc',
            default                                 => 'desc',
        };
    }
}
