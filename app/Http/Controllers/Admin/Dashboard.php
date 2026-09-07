<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Hotel;

class Dashboard extends Controller
{
    public function __invoke()
    {
        $destCount = Destination::count();
        $hotelCount = Hotel::count();
        $avgRating = Destination::avg('rating') ?: 0;
        $categoryCount = Destination::distinct('category')->count();

        $recentDestinations = Destination::withCount('hotels')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'tag' => $d->tag,
                'category' => $d->category,
                'rating' => $d->rating,
                'hotels_count' => $d->hotels_count,
            ]);

        $categories = Destination::selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return inertia('Admin/Dashboard', [
            'stats' => [
                'destinations' => $destCount,
                'hotels' => $hotelCount,
                'avg_rating' => round($avgRating, 1),
                'categories' => $categoryCount,
            ],
            'recentDestinations' => $recentDestinations,
            'categories' => $categories,
        ]);
    }
}
