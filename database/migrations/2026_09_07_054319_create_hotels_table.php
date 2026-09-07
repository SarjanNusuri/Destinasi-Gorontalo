<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('map_url')->nullable();
            $table->string('image')->nullable();
            $table->string('type')->default('Hotel'); // Hotel, Homestay, Villa, Resort, Guesthouse, Eco Lodge
            $table->text('description')->nullable();
            $table->string('price')->nullable(); // "Rp 350.000/malam"
            $table->decimal('rating', 3, 1)->default(0);
            $table->decimal('distance', 5, 1)->nullable(); // km
            $table->integer('duration')->nullable(); // menit
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
