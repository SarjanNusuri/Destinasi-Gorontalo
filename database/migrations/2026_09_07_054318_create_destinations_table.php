<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('map_url')->nullable();
            $table->string('category'); // nature, beach, history, adventure, culture, culinary
            $table->string('tag'); // ALAM, PANTAI, SEJARAH, PETUALANGAN
            $table->string('distance')->nullable(); // "12 km"
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // URL gambar
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->string('location')->nullable(); // "Kabupaten Gorontalo, Gorontalo"
            $table->string('duration')->nullable(); // "1–2 jam"
            $table->decimal('rating', 3, 1)->default(0);
            $table->json('highlights')->nullable(); // ["Wisata perahu", ...]
            $table->string('scene_type')->nullable(); // lake, coral, fort, waterfall
            $table->string('water_color')->nullable(); // hex "#1f7d78"
            $table->string('fog_color')->nullable(); // hex "#0a2a32"
            $table->string('terrain_color')->nullable(); // hex "#2f8f5b"
            $table->string('model_3d_url')->nullable(); // URL model GLB/GLTF
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
