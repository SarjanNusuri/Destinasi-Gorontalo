<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HotelRequest;
use App\Models\Destination;
use App\Models\Hotel;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::with('destination')
            ->get()
            ->map(fn ($h) => [
                'id' => $h->id,
                'name' => $h->name,
                'type' => $h->type,
                'price' => $h->price,
                'rating' => $h->rating,
                'distance' => $h->distance,
                'image' => $h->image,
                'destination_name' => $h->destination?->name,
                'destination_id' => $h->destination_id,
            ]);

        return inertia('Admin/Hotels/Index', ['hotels' => $hotels]);
    }

    public function create()
    {
        $destinations = Destination::select('id', 'name')->get();

        return inertia('Admin/Hotels/Create', ['destinations' => $destinations]);
    }

    public function store(HotelRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'hotel_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('hotels', $filename, 'assets');
            $data['image'] = '/assets/images/hotels/' . $filename;
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

        $hotel = Hotel::create($data);

        // Auto-link to nearest destination
        $hotel->autoLinkToNearestDestination();

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel berhasil ditambahkan dan otomatis terhubung ke destinasi terdekat.');
    }

    public function edit($id)
    {
        $hotel = Hotel::findOrFail($id);
        $destinations = Destination::select('id', 'name')->get();
        $nearest = $hotel->getNearestDestinationInfo();

        return inertia('Admin/Hotels/Edit', [
            'hotel' => [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'map_url' => $hotel->map_url,
                'image' => $hotel->image,
                'type' => $hotel->type,
                'description' => $hotel->description,
                'price' => $hotel->price,
                'rating' => $hotel->rating,
                'distance' => $hotel->distance,
                'lat' => $hotel->lat,
                'lng' => $hotel->lng,
                'destination_id' => $hotel->destination_id,
                'destination_name' => $hotel->destination?->name,
            ],
            'destinations' => $destinations,
            'nearest' => $nearest,
        ]);
    }

    public function update(HotelRequest $request, $id)
    {
        $hotel = Hotel::findOrFail($id);
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'hotel_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('hotels', $filename, 'assets');
            $data['image'] = '/assets/images/hotels/' . $filename;
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

        $hotel->update($data);

        // Re-link to nearest destination
        $hotel->autoLinkToNearestDestination();

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel berhasil diupdate.');
    }

    public function destroy($id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->delete();

        return redirect()->route('admin.hotels.index')->with('success', 'Hotel berhasil dihapus.');
    }

    /**
     * Parse lat/lng from Google Maps URL.
     */
    private function parseGoogleMapsUrl(string $url): ?array
    {
        if (preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        if (preg_match('/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        if (preg_match('/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $m)) {
            return ['lat' => (float) $m[1], 'lng' => (float) $m[2]];
        }
        return null;
    }
}
