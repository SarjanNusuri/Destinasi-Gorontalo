<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Hotel;
use App\Models\Budaya;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->input('category', 'all');
        $budayaPage = $request->input('budaya_page', 1);

        $destinationsQuery = Destination::with('hotels');

        if ($category !== 'all') {
            $destinationsQuery->where('category', $category);
        }

        $destinationsPaginator = $destinationsQuery->orderBy('id')->paginate(6)->withQueryString();

        $destinations = $destinationsPaginator->getCollection()->map(function ($d) {
            return $this->formatDestination($d);
        });

        $hotelsPaginator = Hotel::with('destination')
            ->orderBy('id')
            ->paginate(6, ['*'], 'hotels_page');

        $hotels = $hotelsPaginator->getCollection()->map(function ($h) {
            return [
                'id' => 'h' . $h->id,
                'name' => $h->name,
                'type' => $h->type,
                'description' => $h->description,
                'price' => $h->price,
                'rating' => $h->rating,
                'distance' => $h->distance,
                'duration' => $h->duration,
                'lat' => $h->lat,
                'lng' => $h->lng,
                'image' => $h->image,
                'destinationName' => $h->destination->name ?? '-',
                'destinationId' => $h->destination_id,
            ];
        });

        $allDestinations = Destination::with('hotels')->orderBy('id')->get()->map(function ($d) {
            return $this->formatDestination($d);
        });

        $budayaPaginator = Budaya::orderBy('id')->paginate(3, ['*'], 'budaya_page');
        $budaya = $budayaPaginator->getCollection();

        return inertia('Welcome', [
            'destinations' => $destinations,
            'allDestinations' => $allDestinations,
            'destinationsMeta' => [
                'current_page' => $destinationsPaginator->currentPage(),
                'last_page' => $destinationsPaginator->lastPage(),
                'per_page' => $destinationsPaginator->perPage(),
                'total' => $destinationsPaginator->total(),
            ],
            'hotels' => $hotels,
            'hotelsMeta' => [
                'current_page' => $hotelsPaginator->currentPage(),
                'last_page' => $hotelsPaginator->lastPage(),
                'per_page' => $hotelsPaginator->perPage(),
                'total' => $hotelsPaginator->total(),
            ],
            'budaya' => $budaya,
            'budayaMeta' => [
                'current_page' => $budayaPaginator->currentPage(),
                'last_page' => $budayaPaginator->lastPage(),
                'per_page' => $budayaPaginator->perPage(),
                'total' => $budayaPaginator->total(),
            ],
            'activeCategory' => $category,
        ]);
    }

    private function formatDestination(Destination $d): array
    {
        return [
            'id' => $d->id,
            'name' => $d->name,
            'category' => $d->category,
            'tag' => $d->tag,
            'distance' => $d->distance_from_center . ' km',
            'description' => $d->description,
            'image' => $d->image,
            'lat' => $d->lat,
            'lng' => $d->lng,
            'details' => [
                'location' => $d->location,
                'duration' => $d->duration,
                'rating' => $d->rating,
                'highlights' => $d->highlights ?? [],
            ],
            'sceneConfig' => [
                'type' => $d->scene_type,
                'waterColor' => $d->water_color ? hexdec(str_replace('#', '0x', $d->water_color)) : null,
                'fogColor' => $d->fog_color ? hexdec(str_replace('#', '0x', $d->fog_color)) : null,
                'terrainColor' => $d->terrain_color ? hexdec(str_replace('#', '0x', $d->terrain_color)) : null,
            ],
            'hotels' => $d->hotels->map(fn ($h) => [
                'id' => 'h' . $h->id,
                'name' => $h->name,
                'type' => $h->type,
                'description' => $h->description,
                'price' => $h->price,
                'rating' => $h->rating,
                'distance' => $h->distance,
                'duration' => $h->duration,
                'lat' => $h->lat,
                'lng' => $h->lng,
                'image' => $h->image,
            ])->toArray(),
        ];
    }
}
