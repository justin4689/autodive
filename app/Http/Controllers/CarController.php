<?php

namespace App\Http\Controllers;

use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Models\Car;
use App\Models\CarImage;
use App\Services\CarImageService;
use App\Services\CarSearchService;
use App\Services\CarService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function __construct(
        private readonly CarService $carService,
        private readonly CarSearchService $searchService,
        private readonly CarImageService $imageService,
    ) {}

    public function index(): Response
    {
        $cars = $this->searchService->search(request()->query());

        return Inertia::render('Cars/Index', [
            'cars'    => $cars,
            'filters' => request()->query(),
            'options' => $this->searchService->filterOptions(),
            'makes'   => $this->carService->getMakesWithModels(),
        ]);
    }

    public function show(Car $car): Response
    {
        $this->authorize('view', $car);

        $car = $this->carService->getActiveListing($car->id);

        return Inertia::render('Cars/Show', [
            'car' => $car,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Car::class);

        return Inertia::render('Cars/Create', [
            'makes'   => $this->carService->getMakesWithModels(),
            'options' => $this->searchService->filterOptions(),
        ]);
    }

    public function store(StoreCarRequest $request): RedirectResponse
    {
        $this->authorize('create', Car::class);

        $car = $this->carService->createCar(
            $request->user()->id,
            $request->validated(),
            $request->file('images', []),
        );

        return redirect()->route('cars.show', $car)
            ->with('success', 'Your listing has been published.');
    }

    public function edit(Car $car): Response
    {
        $this->authorize('update', $car);

        return Inertia::render('Cars/Edit', [
            'car'     => $car->load(['make', 'carModel', 'images']),
            'makes'   => $this->carService->getMakesWithModels(),
            'options' => $this->searchService->filterOptions(),
        ]);
    }

    public function update(UpdateCarRequest $request, Car $car): RedirectResponse
    {
        $this->authorize('update', $car);

        $this->carService->updateCar($car, $request->validated());

        return redirect()->route('cars.show', $car)
            ->with('success', 'Listing updated.');
    }

    public function destroy(Car $car): RedirectResponse
    {
        $this->authorize('delete', $car);

        $this->carService->deleteCar($car);

        return redirect()->route('dashboard')
            ->with('success', 'Listing deleted.');
    }

    public function destroyImage(Car $car, CarImage $image): RedirectResponse
    {
        $this->authorize('deleteImage', $car);

        $this->imageService->deleteImage($image);

        return back()->with('success', 'Image removed.');
    }
}
