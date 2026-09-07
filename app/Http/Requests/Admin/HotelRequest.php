<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class HotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'map_url' => 'nullable|string|max:2048',
            'image' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|max:2048',
            'type' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'price' => 'nullable|string|max:100',
            'rating' => 'nullable|numeric|between:0,5',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
        ];
    }
}
