<?php

namespace App\Http\Controllers;

use App\Services\CarService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private readonly CarService $carService) {}

    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'featured' => $this->carService->getFeaturedListings(16),
            'makes'    => $this->carService->getMakesWithModels(),
        ]);
    }
}
