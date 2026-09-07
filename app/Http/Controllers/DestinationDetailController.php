<?php

namespace App\Http\Controllers;

use App\Models\Destination;

class DestinationDetailController extends Controller
{
    public function show($id)
    {
        $d = Destination::with('hotels')->findOrFail($id);

        $destination = [
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
                'modelUrl' => $d->model_3d_url,
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

        return inertia('DestinationDetail', ['destination' => $destination]);
    }
}
