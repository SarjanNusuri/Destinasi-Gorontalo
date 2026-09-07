<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT');

        $rules = [
            'name' => 'required|string|max:255',
            'category' => 'required|in:nature,beach,history,adventure,culture,culinary',
            'tag' => 'required|string|max:50',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|max:2048',
            'map_url' => 'nullable|string|max:2048',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'location' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:100',
            'rating' => 'nullable|numeric|between:0,5',
            'highlights' => 'nullable|array',
            'highlights.*' => 'nullable|string|max:255',
            'scene_type' => 'nullable|in:lake,coral,fort,waterfall',
            'water_color' => 'nullable|string|max:20',
            'fog_color' => 'nullable|string|max:20',
            'terrain_color' => 'nullable|string|max:20',
            'model_3d_url' => 'nullable|string|max:2048',
        ];

        if ($isUpdate) {
            $rules['hotels'] = 'nullable|array';
            $rules['hotels.*.name'] = 'required_with:hotels|string|max:255';
            $rules['hotels.*.type'] = 'nullable|string|max:50';
            $rules['hotels.*.description'] = 'nullable|string';
            $rules['hotels.*.price'] = 'nullable|string|max:100';
            $rules['hotels.*.rating'] = 'nullable|numeric|between:0,5';
            $rules['hotels.*.distance'] = 'nullable|numeric';
            $rules['hotels.*.duration'] = 'nullable|integer';
            $rules['hotels.*.lat'] = 'nullable|numeric|between:-90,90';
            $rules['hotels.*.lng'] = 'nullable|numeric|between:-180,180';
        }

        return $rules;
    }
}
