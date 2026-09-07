<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'tag',
        'distance',
        'description',
        'image',
        'map_url',
        'lat',
        'lng',
        'location',
        'duration',
        'rating',
        'highlights',
        'scene_type',
        'water_color',
        'fog_color',
        'terrain_color',
        'model_3d_url',
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'rating' => 'float',
        'highlights' => 'array',
    ];

    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }

    /**
     * Calculate distance from Gorontalo city center using Haversine formula.
     * Returns distance in km.
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
     * Calculate distance from a given point (user location).
     * Returns distance in km.
     */
    public function getDistanceFrom(float $userLat, float $userLng): float
    {
        $earthRadius = 6371;

        $dLat = deg2rad($this->lat - $userLat);
        $dLng = deg2rad($this->lng - $userLng);

        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($userLat)) * cos(deg2rad($this->lat)) *
             sin($dLng / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 1);
    }
}
