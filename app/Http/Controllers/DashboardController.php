<?php

namespace App\Http\Controllers;

use App\Enums\CarStatus;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = request()->user();

        $cars = $user->cars()
            ->with(['make', 'carModel', 'primaryImage'])
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'listings' => $cars,
            'stats'    => [
                'total'  => $cars->count(),
                'active' => $cars->where('status', CarStatus::Active)->count(),
                'sold'   => $cars->where('status', CarStatus::Sold)->count(),
                'draft'  => $cars->where('status', CarStatus::Draft)->count(),
            ],
        ]);
    }
}
