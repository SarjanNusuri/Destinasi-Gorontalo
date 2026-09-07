<?php

namespace App\Http\Controllers;

use App\Models\Hotel;

class HotelDetailController extends Controller
{
    public function show($id)
    {
        $h = Hotel::with('destination')->findOrFail($id);
        $nearest = $h->getNearestDestinationInfo();

        $hotel = [
            'id' => $h->id,
            'name' => $h->name,
            'type' => $h->type,
            'description' => $h->description,
            'price' => $h->price,
            'rating' => $h->rating,
            'distance' => $h->distance,
            'image' => $h->image,
            'lat' => $h->lat,
            'lng' => $h->lng,
            'distance_from_center' => $h->distance_from_center . ' km',
            'sceneConfig' => [
                'type' => $h->scene_type,
                'waterColor' => $h->water_color ? hexdec(str_replace('#', '0x', $h->water_color)) : null,
                'fogColor' => $h->fog_color ? hexdec(str_replace('#', '0x', $h->fog_color)) : null,
                'terrainColor' => $h->terrain_color ? hexdec(str_replace('#', '0x', $h->terrain_color)) : null,
                'modelUrl' => $h->model_3d_url,
            ],
            'destination' => $h->destination ? [
                'id' => $h->destination->id,
                'name' => $h->destination->name,
                'tag' => $h->destination->tag,
                'image' => $h->destination->image,
                'lat' => $h->destination->lat,
                'lng' => $h->destination->lng,
            ] : null,
            'nearest' => $nearest,
        ];

        return inertia('HotelDetail', ['hotel' => $hotel]);
    }
}
