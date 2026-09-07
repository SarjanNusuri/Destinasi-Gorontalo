<?php

namespace App\Http\Controllers;

use App\Models\Destination;

class MapController extends Controller
{
    public function index()
    {
        $destinations = Destination::with('hotels')->get()->map(function ($d) {
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
        });

        return inertia('Map', ['destinations' => $destinations]);
    }
}
