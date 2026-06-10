<?php

namespace Database\Seeders;

use App\Models\CarModel;
use App\Models\Make;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MakeSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Toyota'     => ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Prius'],
            'Honda'      => ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline', 'HR-V', 'Passport'],
            'Ford'       => ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco', 'Ranger', 'Expedition'],
            'Chevrolet'  => ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro', 'Colorado', 'Tahoe', 'Suburban'],
            'Nissan'     => ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier', 'Maxima', 'Murano', '370Z'],
            'BMW'        => ['3 Series', '5 Series', 'X3', 'X5', 'X7', 'M3', 'M5', '7 Series'],
            'Mercedes'   => ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class', 'A-Class', 'G-Class', 'AMG GT'],
            'Audi'       => ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'TT', 'R8'],
            'Hyundai'    => ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Ioniq 5', 'Ioniq 6'],
            'Kia'        => ['Forte', 'K5', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Stinger', 'EV6'],
            'Jeep'       => ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
            'Volkswagen' => ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'ID.4', 'Taos'],
            'Lexus'      => ['ES', 'IS', 'RX', 'NX', 'GX', 'LS', 'LC', 'UX'],
            'Tesla'      => ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
            'Dodge'      => ['Challenger', 'Charger', 'Durango', 'Ram 1500', 'Journey'],
        ];

        foreach ($data as $makeName => $models) {
            $make = Make::create([
                'name' => $makeName,
                'slug' => Str::slug($makeName),
            ]);

            foreach ($models as $modelName) {
                CarModel::create([
                    'make_id' => $make->id,
                    'name'    => $modelName,
                    'slug'    => Str::slug($modelName),
                ]);
            }
        }
    }
}
