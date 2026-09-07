<?php

namespace Database\Seeders;

use App\Models\Budaya;
use Illuminate\Database\Seeder;

class BudayaSeeder extends Seeder
{
    public function run(): void
    {
        $budaya = [
            [
                'title' => 'Tari Saronde',
                'subtitle' => 'Tari Tradisional',
                'description' => 'Tari penyambutan pengantin pria dalam upacara adat Gorontalo. Gerakan lemah gemulai mencerminkan keanggunan budaya Hulondalo.',
                'image' => 'https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=600&h=400&fit=crop&auto=format',
            ],
            [
                'title' => 'Upacara Adat Maulid',
                'subtitle' => 'Tradisi & Ritual',
                'description' => 'Perayaan Maulid Nabi dengan tradisi khas Gorontalo. Masyarakat berkumpul membaca barzanji dan membawa bunga ke masjid.',
                'image' => 'https://images.unsplash.com/photo-1542897643-8158da5b4607?w=600&h=400&fit=crop&auto=format',
            ],
            [
                'title' => 'Kerajinan Karawo',
                'subtitle' => 'Seni Sulam',
                'description' => 'Sulaman tangan khas Gorontalo yang dikerjakan dengan jarum halus. Setiap motif memiliki makna filosofis tersendiri.',
                'image' => 'https://images.unsplash.com/photo-1524341661047-3a38ae8987f9?w=600&h=400&fit=crop&auto=format',
            ],
            [
                'title' => 'Bambu Pohung',
                'subtitle' => 'Kesenian',
                'description' => 'Musik tradisional dari bambu yang dimainkan secara berkelompok. Iringan khas dalam upacara adat Gorontalo.',
                'image' => 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop&auto=format',
            ],
            [
                'title' => 'Bubur Tinutuan',
                'subtitle' => 'Kuliner Tradisional',
                'description' => 'Bubur khas Gorontalo yang terbuat dari campuran beras, jagung, labu, dan ubi. Sarapan tradisional masyarakat Gorontalo.',
                'image' => 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&auto=format',
            ],
            [
                'title' => 'Rumah Adat Dulohupa',
                'subtitle' => 'Arsitektur',
                'description' => 'Rumah adat tradisional Gorontalo dengan atap bertingkat dan tiang-tiang kayu yang kokoh. Simbol kearifan lokal.',
                'image' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop&auto=format',
            ],
        ];

        foreach ($budaya as $item) {
            Budaya::create($item);
        }
    }
}
