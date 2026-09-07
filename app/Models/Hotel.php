<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'destination_id',
        'name',
        'map_url',
        'image',
        'type',
        'description',
        'price',
        'rating',
        'distance',
        'duration',
        'lat',
        'lng',
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'rating' => 'float',
        'distance' => 'float',
        'duration' => 'integer',
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Calculate distance from Gorontalo city center.
     */
    public function getDistanceFromCenterAttribute(): float
    {
        $centerLat = -0.5407;
        $centerLng = 123.0558;

        $earthRadius = 6371;
        $dLat = deg2rad($this->lat - $centerLat);
        $dLng = deg2rad($this->lng - $centerLng);
        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($centerLat)) * cos(deg2rad($this->lat)) *
             sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 1);
    }

    /**
     * Find the nearest destination and return info.
     */
    public function getNearestDestinationInfo(): ?array
    {
        $destinations = Destination::all();
        $minDist = PHP_FLOAT_MAX;
        $nearest = null;

        foreach ($destinations as $dest) {
            $dist = $this->calcHaversine($this->lat, $this->lng, $dest->lat, $dest->lng);
            if ($dist < $minDist) {
                $minDist = $dist;
                $nearest = $dest;
            }
        }

        if (!$nearest) return null;

        return [
            'id' => $nearest->id,
            'name' => $nearest->name,
            'tag' => $nearest->tag,
            'image' => $nearest->image,
            'distance' => round($minDist, 1),
        ];
    }

    /**
     * Auto-link to nearest destination.
     */
    public function autoLinkToNearestDestination(): void
    {
        $info = $this->getNearestDestinationInfo();
        if ($info) {
            $this->update([
                'destination_id' => $info['id'],
                'distance' => $info['distance'],
            ]);
        }
    }

    private function calcHaversine(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}
