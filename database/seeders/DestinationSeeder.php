<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Hotel;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Danau Limboto',
                'category' => 'nature',
                'tag' => 'ALAM',
                'description' => 'Danau terbesar di Gorontalo dengan ekosistem unik dan sunset yang memukau.',
                'image' => 'https://images.unsplash.com/photo-1630399477185-8135fa7c02ae?w=600&h=400&fit=crop&auto=format',
                'lat' => 0.5333,
                'lng' => 123.0333,
                'location' => 'Kabupaten Gorontalo, Gorontalo',
                'duration' => '1–2 jam',
                'rating' => 4.5,
                'highlights' => [
                    'Wisata perahu nelayan tradisional',
                    'Menara pandang di tepi danau',
                    'Panorama terbaik saat senja',
                    'Ekosistem ikan endemik',
                    'Edukasi konservasi air tawar',
                ],
                'scene_type' => 'lake',
                'water_color' => '#1f7d78',
                'fog_color' => '#0a2a32',
                'terrain_color' => '#2f8f5b',
            ],
            [
                'name' => 'Pantai Olele',
                'category' => 'beach',
                'tag' => 'PANTAI',
                'description' => 'Surga bawah laut dengan terumbu karang spektakuler dan air jernih membiru.',
                'image' => 'https://images.unsplash.com/photo-1627967464841-6b32176ddbe8?w=600&h=400&fit=crop&auto=format',
                'lat' => 0.55,
                'lng' => 123.05,
                'location' => 'Kabila Bone, Gorontalo',
                'duration' => 'Setengah – 1 hari',
                'rating' => 4.9,
                'highlights' => [
                    'Spot diving Cave Point & Traffic Light',
                    'Terumbu karang berusia ratusan tahun',
                    'Homestay nelayan setempat',
                    'Snorkeling area terumbu dangkal',
                    'Muck diving biota langka',
                ],
                'scene_type' => 'coral',
                'water_color' => '#0c4d55',
                'fog_color' => '#081a20',
                'terrain_color' => '#123840',
            ],
            [
                'name' => 'Benteng Otanaha',
                'category' => 'history',
                'tag' => 'SEJARAH',
                'description' => 'Benteng bersejarah peninggalan Portugis dengan pemandangan Teluk Gorontalo.',
                'image' => 'https://images.unsplash.com/photo-1628000190980-ca80ff499ecf?w=600&h=400&fit=crop&auto=format',
                'lat' => 0.54,
                'lng' => 123.06,
                'location' => 'Kota Gorontalo, Gorontalo',
                'duration' => '1–2 jam',
                'rating' => 4.6,
                'highlights' => [
                    '235 anak tangga menuju puncak',
                    'Panorama 360° Danau Limboto',
                    'Situs cagar budaya nasional',
                    'Arsitektur batu kapur abad ke-16',
                    'Bendera tradisi di menara puncak',
                ],
                'scene_type' => 'fort',
                'water_color' => '#c1603d',
                'fog_color' => '#081a20',
                'terrain_color' => '#3a7a4d',
            ],
            [
                'name' => 'Air Terjun Tapadaa',
                'category' => 'adventure',
                'tag' => 'PETUALANGAN',
                'description' => 'Air terjun bertingkat di tengah hutan tropis yang masih alami dan tersembunyi.',
                'image' => 'https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?w=600&h=400&fit=crop&auto=format',
                'lat' => 0.48,
                'lng' => 123.12,
                'location' => 'Bone Bolango, Gorontalo',
                'duration' => '3–4 jam (trekking)',
                'rating' => 4.7,
                'highlights' => [
                    'Trekking hutan tropis alami',
                    'Kolam alami di bawah air terjun',
                    'Satwa liar & burung endemik',
                    'Spot foto air terjun bertingkat',
                    'Camping ground di sekitar lokasi',
                ],
                'scene_type' => 'waterfall',
                'water_color' => '#4aa8d8',
                'fog_color' => '#081a20',
                'terrain_color' => '#2f6b3a',
            ],
        ];

        foreach ($destinations as $destData) {
            $hotelsData = $destData['hotels'] ?? [];
            unset($destData['hotels']);

            $dest = Destination::create($destData);

            $hotelList = match ($dest->name) {
                'Danau Limboto' => [
                    ['name' => 'Hotel Limboto Indah', 'type' => 'Hotel', 'description' => 'Hotel bintang 3 tepi danau dengan kamar view langsung ke Danau Limboto.', 'price' => 'Rp 350.000/malam', 'rating' => 4.3, 'distance' => 2.1, 'duration' => 5, 'lat' => 0.5310, 'lng' => 123.0310, 'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Pondok Wisata Bahari', 'type' => 'Homestay', 'description' => 'Homestay milik warga setempat dengan suasana desa yang asri.', 'price' => 'Rp 150.000/malam', 'rating' => 4.1, 'distance' => 1.8, 'duration' => 4, 'lat' => 0.5350, 'lng' => 123.0350, 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Villa Tirta Mas', 'type' => 'Villa', 'description' => 'Villa privat dengan halaman luas dan akses langsung ke tepi danau.', 'price' => 'Rp 800.000/malam', 'rating' => 4.6, 'distance' => 3.2, 'duration' => 8, 'lat' => 0.5290, 'lng' => 123.0290, 'image' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop&auto=format'],
                ],
                'Pantai Olele' => [
                    ['name' => 'Olele Beach Resort', 'type' => 'Resort', 'description' => 'Resort tepi pantai dengan akses langsung ke spot snorkeling.', 'price' => 'Rp 550.000/malam', 'rating' => 4.7, 'distance' => 0.5, 'duration' => 2, 'lat' => 0.5520, 'lng' => 123.0520, 'image' => 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Homestay Nelayan Olele', 'type' => 'Homestay', 'description' => 'Homestay sederhana milik nelayan setempat.', 'price' => 'Rp 120.000/malam', 'rating' => 4.2, 'distance' => 1.2, 'duration' => 3, 'lat' => 0.5480, 'lng' => 123.0480, 'image' => 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Danau Limboto Hotel', 'type' => 'Hotel', 'description' => 'Hotel modern di jalur utama menuju Olele.', 'price' => 'Rp 400.000/malam', 'rating' => 4.4, 'distance' => 8.5, 'duration' => 18, 'lat' => 0.5333, 'lng' => 123.0333, 'image' => 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&auto=format'],
                ],
                'Benteng Otanaha' => [
                    ['name' => 'Grand Gorontalo Hotel', 'type' => 'Hotel', 'description' => 'Hotel bintang 4 di pusat kota, 10 menit dari Benteng Otanaha.', 'price' => 'Rp 650.000/malam', 'rating' => 4.5, 'distance' => 2.8, 'duration' => 7, 'lat' => 0.5420, 'lng' => 123.0580, 'image' => 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Rumah Adat Guesthouse', 'type' => 'Guesthouse', 'description' => 'Guesthouse bergaya tradisional Gorontalo di kaki bukit Otanaha.', 'price' => 'Rp 200.000/malam', 'rating' => 4.3, 'distance' => 1.5, 'duration' => 4, 'lat' => 0.5410, 'lng' => 123.0610, 'image' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Sultan Hotel Gorontalo', 'type' => 'Hotel', 'description' => 'Hotel bersejarah di jalan utama kota Gorontalo.', 'price' => 'Rp 480.000/malam', 'rating' => 4.4, 'distance' => 3.5, 'duration' => 9, 'lat' => 0.5380, 'lng' => 123.0550, 'image' => 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=300&fit=crop&auto=format'],
                ],
                'Air Terjun Tapadaa' => [
                    ['name' => 'Bone Bolango Eco Lodge', 'type' => 'Eco Lodge', 'description' => 'Penginapan ramah lingkungan di pinggir hutan.', 'price' => 'Rp 300.000/malam', 'rating' => 4.5, 'distance' => 5.2, 'duration' => 12, 'lat' => 0.4820, 'lng' => 123.1180, 'image' => 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Rumah Panjang Bongo', 'type' => 'Homestay', 'description' => 'Rumah adat Bongo yang dimodernisasi sebagai penginapan.', 'price' => 'Rp 180.000/malam', 'rating' => 4.2, 'distance' => 7.8, 'duration' => 18, 'lat' => 0.4850, 'lng' => 123.1250, 'image' => 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop&auto=format'],
                    ['name' => 'Hotel Tilamuta', 'type' => 'Hotel', 'description' => 'Hotel nyaman di kota Tilamuta, titik kota terdekat sebelum trekking.', 'price' => 'Rp 280.000/malam', 'rating' => 4.0, 'distance' => 12.5, 'duration' => 25, 'lat' => 0.4750, 'lng' => 123.1100, 'image' => 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop&auto=format'],
                ],
                default => [],
            };

            foreach ($hotelList as $hotel) {
                $dest->hotels()->create($hotel);
            }
        }
    }
}
