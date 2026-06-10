<?php

namespace App\Services;

use App\Models\Car;
use App\Models\Make;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CarService
{
    public function __construct(
        private readonly CarImageService $imageService,
    ) {}

    public function createCar(int $userId, array $data, array $images = []): Car
    {
        $car = Car::create([...$data, 'user_id' => $userId]);

        if ($images) {
            $this->imageService->storeImages($car, $images);
        }

        return $car->load(['make', 'carModel', 'primaryImage']);
    }

    public function updateCar(Car $car, array $data): Car
    {
        $car->update($data);

        return $car->refresh()->load(['make', 'carModel', 'primaryImage']);
    }

    public function deleteCar(Car $car): void
    {
        $this->imageService->deleteAllImages($car);
        $car->delete();
    }

    public function getActiveListing(int $id): Car
    {
        return Car::active()
            ->with(['make', 'carModel', 'images', 'user'])
            ->findOrFail($id);
    }

    public function getFeaturedListings(int $limit = 8): \Illuminate\Database\Eloquent\Collection
    {
        return Car::active()
            ->with(['make', 'carModel', 'primaryImage'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getMakesWithModels(): \Illuminate\Database\Eloquent\Collection
    {
        return Make::with('carModels')->orderBy('name')->get();
    }
}
