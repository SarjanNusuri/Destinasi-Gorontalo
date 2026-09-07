<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DestinationRequest;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::withCount('hotels')
            ->with('hotels')
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'tag' => $d->tag,
                'category' => $d->category,
                'location' => $d->location,
                'distance' => $d->distance_from_center . ' km',
                'rating' => $d->rating,
                'hotels_count' => $d->hotels_count,
                'image' => $d->image,
            ]);

        return inertia('Admin/Destinations/Index', ['destinations' => $destinations]);
    }

    public function create()
    {
        return inertia('Admin/Destinations/Create');
    }

    public function store(DestinationRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'dest_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('destinations', $filename, 'assets');
            $data['image'] = '/assets/images/destinations/' . $filename;
        }
        unset($data['image_file']);

        // Parse lat/lng from Google Maps URL if not provided
        if (empty($data['lat']) && !empty($data['map_url'])) {
            $coords = $this->parseGoogleMapsUrl($data['map_url']);
            if ($coords) {
                $data['lat'] = $coords['lat'];
                $data['lng'] = $coords['lng'];
            }
        }

        // Auto-calculate distance from city center
        if (!empty($data['lat']) && !empty($data['lng'])) {
            $data['distance'] = $this->calcDistance(-0.5407, 123.0558, $data['lat'], $data['lng']) . ' km';
        }

        $destination = Destination::create($data);

        return redirect()->route('admin.destinations.edit', $destination->id)
            ->with('success', 'Destinasi berhasil dibuat. Silakan lengkapi rating dan penginapan.');
    }

    public function edit($id)
    {
        $destination = Destination::with('hotels')->findOrFail($id);

        return inertia('Admin/Destinations/Edit', [
            'destination' => [
                'id' => $destination->id,
                'name' => $destination->name,
                'category' => $destination->category,
                'tag' => $destination->tag,
                'distance' => $destination->distance,
                'description' => $destination->description,
                'image' => $destination->image,
                'map_url' => $destination->map_url,
                'lat' => $destination->lat,
                'lng' => $destination->lng,
                'location' => $destination->location,
                'duration' => $destination->duration,
                'rating' => $destination->rating,
                'highlights' => $destination->highlights ?? [],
                'scene_type' => $destination->scene_type,
                'water_color' => $destination->water_color,
                'fog_color' => $destination->fog_color,
                'terrain_color' => $destination->terrain_color,
                'model_3d_url' => $destination->model_3d_url,
                'hotels' => $destination->hotels->map(fn ($h) => [
                    'id' => $h->id,
                    'name' => $h->name,
                    'type' => $h->type,
                    'description' => $h->description,
                    'price' => $h->price,
                    'rating' => $h->rating,
                    'distance' => $h->distance,
                    'duration' => $h->duration,
                    'lat' => $h->lat,
                    'lng' => $h->lng,
                ])->toArray(),
            ],
        ]);
    }

    public function update(DestinationRequest $request, $id)
    {
        $destination = Destination::findOrFail($id);
        $data = $request->validated();
        $hotelsData = $data['hotels'] ?? [];
        unset($data['hotels']);

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'dest_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('destinations', $filename, 'assets');
            $data['image'] = '/assets/images/destinations/' . $filename;
        }
        unset($data['image_file']);

        // Parse lat/lng from Google Maps URL if not provided
        if (empty($data['lat']) && !empty($data['map_url'])) {
            $coords = $this->parseGoogleMapsUrl($data['map_url']);
            if ($coords) {
                $data['lat'] = $coords['lat'];
                $data['lng'] = $coords['lng'];
            }
        }

        // Auto-calculate distance from city center
        if (!empty($data['lat']) && !empty($data['lng'])) {
            $data['distance'] = $this->calcDistance(-0.5407, 123.0558, $data['lat'], $data['lng']) . ' km';
        }

        DB::transaction(function () use ($destination, $data, $hotelsData) {
            $destination->update($data);

            // Sync hotels only if provided
            if (!empty($hotelsData)) {
                $destination->hotels()->delete();
                foreach ($hotelsData as $hotel) {
                    $destination->hotels()->create($hotel);
                }
            }
        });

        return redirect()->route('admin.destinations.index')->with('success', 'Destinasi berhasil diupdate.');
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return redirect()->route('admin.destinations.index')->with('success', 'Destinasi berhasil dihapus.');
    }

    /**
     * Parse lat/lng from various Google Maps URL formats.
     */
    private function parseGoogleMapsUrl(string $url): ?array
    {
        // Format: /@lat,lng,zoom
        if (preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        // Format: ?q=lat,lng
        if (preg_match('/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        // Format: ?ll=lat,lng
        if (preg_match('/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        // Format: /maps/place/.../@lat,lng
        if (preg_match('/maps\/place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }

        return null;
    }

    private function calcDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return round($earthRadius * $c, 1);
    }
}
