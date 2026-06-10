<?php

namespace Database\Seeders;

use App\Enums\BodyType;
use App\Enums\CarCondition;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\Transmission;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\CarModel;
use App\Models\Make;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class CarSeeder extends Seeder
{
    // Unsplash photo IDs mapped to car type
    private const PHOTOS = [
        'sedan'   => [
            '1492144534655-ae79c964c9d7',
            '1552519507-da3b142c6e3d',
            '1567818735868-e71b99932e29',
            '1617788138017-80ad40651399',
        ],
        'suv'     => [
            '1519641471654-76ce0107ad1b',
            '1551830820-330a71b99659',
            '1563720223185-11003d516935',
            '1609521263047-f8f205293f24',
        ],
        'coupe'   => [
            '1503376780353-7e6692767b70',
            '1542362567-b07e54358753',
            '1555215695-3004980ad54e',
            '1583121274602-3e2820c69888',
        ],
        'pickup'  => [
            '1533473359331-0135ef1b58bf',
            '1558618666-fcd25c85cd64',
        ],
        'electric' => [
            '1560958089-b8a1929cea89',
            '1554744512-d6c603f27c54',
        ],
    ];

    private array $photoIndexes = [];

    private function nextPhoto(string $type): string
    {
        $pool = self::PHOTOS[$type] ?? self::PHOTOS['sedan'];
        $i    = $this->photoIndexes[$type] ?? 0;
        $id   = $pool[$i % count($pool)];
        $this->photoIndexes[$type] = $i + 1;
        return $id;
    }

    public function run(): void
    {
        $seller = User::firstOrCreate(
            ['email' => 'seller@autodive.com'],
            ['name' => 'AutoDive Seller', 'password' => bcrypt('password')],
        );

        $listings = [
            // Toyota
            ['make' => 'Toyota',    'model' => 'Camry',       'year' => 2022, 'price' => 22500, 'mileage' => 18000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Silver',      'city' => 'Los Angeles', 'state' => 'CA', 'photo' => 'sedan'],
            ['make' => 'Toyota',    'model' => 'RAV4',        'year' => 2022, 'price' => 33500, 'mileage' => 12000, 'fuel' => FuelType::Hybrid,   'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Chicago',     'state' => 'IL', 'photo' => 'suv'],
            ['make' => 'Toyota',    'model' => 'Prius',       'year' => 2023, 'price' => 28000, 'mileage' => 5000,  'fuel' => FuelType::Hybrid,   'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Blue',        'city' => 'Seattle',     'state' => 'WA', 'photo' => 'sedan'],
            ['make' => 'Toyota',    'model' => 'Tacoma',      'year' => 2021, 'price' => 36000, 'mileage' => 21000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Pickup, 'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Gray',        'city' => 'Denver',      'state' => 'CO', 'photo' => 'pickup'],
            // Honda
            ['make' => 'Honda',     'model' => 'CR-V',        'year' => 2023, 'price' => 31000, 'mileage' => 8000,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Gray',        'city' => 'Houston',     'state' => 'TX', 'photo' => 'suv'],
            ['make' => 'Honda',     'model' => 'Civic',       'year' => 2023, 'price' => 24000, 'mileage' => 6500,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Black',       'city' => 'New York',    'state' => 'NY', 'photo' => 'sedan'],
            ['make' => 'Honda',     'model' => 'Accord',      'year' => 2022, 'price' => 27500, 'mileage' => 14000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Miami',       'state' => 'FL', 'photo' => 'sedan'],
            // Ford
            ['make' => 'Ford',      'model' => 'F-150',       'year' => 2021, 'price' => 38500, 'mileage' => 24000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Pickup, 'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Blue',        'city' => 'Dallas',      'state' => 'TX', 'photo' => 'pickup'],
            ['make' => 'Ford',      'model' => 'Mustang',     'year' => 2021, 'price' => 32000, 'mileage' => 15000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Coupe,  'trans' => Transmission::Manual,    'cond' => CarCondition::Used, 'color' => 'Red',         'city' => 'Miami',       'state' => 'FL', 'photo' => 'coupe'],
            ['make' => 'Ford',      'model' => 'Bronco',      'year' => 2022, 'price' => 41500, 'mileage' => 10000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Orange',      'city' => 'Phoenix',     'state' => 'AZ', 'photo' => 'suv'],
            // Chevrolet
            ['make' => 'Chevrolet', 'model' => 'Camaro',      'year' => 2020, 'price' => 35000, 'mileage' => 22000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Coupe,  'trans' => Transmission::Manual,    'cond' => CarCondition::Used, 'color' => 'Yellow',      'city' => 'Phoenix',     'state' => 'AZ', 'photo' => 'coupe'],
            ['make' => 'Chevrolet', 'model' => 'Silverado',   'year' => 2021, 'price' => 42000, 'mileage' => 18000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Pickup, 'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Black',       'city' => 'Atlanta',     'state' => 'GA', 'photo' => 'pickup'],
            ['make' => 'Chevrolet', 'model' => 'Equinox',     'year' => 2023, 'price' => 28000, 'mileage' => 7000,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Las Vegas',   'state' => 'NV', 'photo' => 'suv'],
            // BMW
            ['make' => 'BMW',       'model' => '3 Series',    'year' => 2022, 'price' => 42000, 'mileage' => 12000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Boston',      'state' => 'MA', 'photo' => 'coupe'],
            ['make' => 'BMW',       'model' => 'X5',          'year' => 2021, 'price' => 62000, 'mileage' => 20000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Black',       'city' => 'New York',    'state' => 'NY', 'photo' => 'suv'],
            // Mercedes
            ['make' => 'Mercedes',  'model' => 'C-Class',     'year' => 2021, 'price' => 48000, 'mileage' => 16000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Silver',      'city' => 'Las Vegas',   'state' => 'NV', 'photo' => 'coupe'],
            ['make' => 'Mercedes',  'model' => 'GLE',         'year' => 2022, 'price' => 67000, 'mileage' => 8000,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Gray',        'city' => 'Los Angeles', 'state' => 'CA', 'photo' => 'suv'],
            // Tesla
            ['make' => 'Tesla',     'model' => 'Model 3',     'year' => 2023, 'price' => 39900, 'mileage' => 4000,  'fuel' => FuelType::Electric, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Los Angeles', 'state' => 'CA', 'photo' => 'electric'],
            ['make' => 'Tesla',     'model' => 'Model Y',     'year' => 2023, 'price' => 44900, 'mileage' => 3000,  'fuel' => FuelType::Electric, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Red',         'city' => 'Miami',       'state' => 'FL', 'photo' => 'electric'],
            // Audi
            ['make' => 'Audi',      'model' => 'Q5',          'year' => 2022, 'price' => 52000, 'mileage' => 14000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'White',       'city' => 'Chicago',     'state' => 'IL', 'photo' => 'suv'],
            ['make' => 'Audi',      'model' => 'A4',          'year' => 2021, 'price' => 38000, 'mileage' => 19000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Sedan,  'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Black',       'city' => 'Boston',      'state' => 'MA', 'photo' => 'sedan'],
            // Dodge
            ['make' => 'Dodge',     'model' => 'Challenger',  'year' => 2019, 'price' => 29500, 'mileage' => 35000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Coupe,  'trans' => Transmission::Manual,    'cond' => CarCondition::Used, 'color' => 'Black',       'city' => 'Houston',     'state' => 'TX', 'photo' => 'coupe'],
            // Jeep
            ['make' => 'Jeep',      'model' => 'Wrangler',    'year' => 2022, 'price' => 45000, 'mileage' => 7000,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Manual,    'cond' => CarCondition::Used, 'color' => 'Orange',      'city' => 'Phoenix',     'state' => 'AZ', 'photo' => 'suv'],
            // Hyundai & Kia
            ['make' => 'Hyundai',   'model' => 'Tucson',      'year' => 2022, 'price' => 29000, 'mileage' => 11000, 'fuel' => FuelType::Hybrid,   'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Blue',        'city' => 'Atlanta',     'state' => 'GA', 'photo' => 'suv'],
            ['make' => 'Kia',       'model' => 'Telluride',   'year' => 2022, 'price' => 37500, 'mileage' => 9000,  'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Gray',        'city' => 'Denver',      'state' => 'CO', 'photo' => 'suv'],
            // Nissan & Lexus
            ['make' => 'Nissan',    'model' => '370Z',        'year' => 2020, 'price' => 31000, 'mileage' => 22000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Coupe,  'trans' => Transmission::Manual,    'cond' => CarCondition::Used, 'color' => 'Blue',        'city' => 'Los Angeles', 'state' => 'CA', 'photo' => 'coupe'],
            ['make' => 'Lexus',     'model' => 'RX',          'year' => 2022, 'price' => 55000, 'mileage' => 10000, 'fuel' => FuelType::Gasoline, 'body' => BodyType::Suv,    'trans' => Transmission::Automatic, 'cond' => CarCondition::Used, 'color' => 'Pearl White', 'city' => 'Las Vegas',   'state' => 'NV', 'photo' => 'suv'],
        ];

        foreach ($listings as $listing) {
            $make  = Make::where('name', $listing['make'])->first();
            $model = $make ? CarModel::where('name', $listing['model'])->where('make_id', $make->id)->first() : null;

            if (! $make || ! $model) {
                $this->command->warn("Skipping {$listing['make']} {$listing['model']} — not found in DB.");
                continue;
            }

            $car = $seller->cars()->create([
                'make_id'      => $make->id,
                'car_model_id' => $model->id,
                'year'         => $listing['year'],
                'price'        => $listing['price'],
                'mileage'      => $listing['mileage'],
                'fuel_type'    => $listing['fuel'],
                'body_type'    => $listing['body'],
                'transmission' => $listing['trans'],
                'condition'    => $listing['cond'],
                'color'        => $listing['color'],
                'description'  => "Clean title, well maintained. {$listing['year']} {$listing['make']} {$listing['model']} in excellent condition. Contact seller for a test drive.",
                'city'         => $listing['city'],
                'state'        => $listing['state'],
                'country'      => 'US',
                'status'       => CarStatus::Active,
            ]);

            $this->downloadImage($car, $this->nextPhoto($listing['photo']));
            $this->command->info("Created: {$listing['year']} {$listing['make']} {$listing['model']}");
        }
    }

    private function downloadImage(Car $car, string $photoId): void
    {
        $url = "https://images.unsplash.com/photo-{$photoId}?auto=format&fit=crop&w=800&q=80";

        try {
            $response = Http::timeout(30)->withoutVerifying()->get($url);

            if (! $response->successful()) {
                return;
            }

            $path = "cars/{$car->id}/image_1.jpg";
            Storage::disk('public')->makeDirectory("cars/{$car->id}");
            Storage::disk('public')->put($path, $response->body());

            CarImage::create([
                'car_id'     => $car->id,
                'path'       => $path,
                'order'      => 0,
                'is_primary' => true,
            ]);
        } catch (\Exception $e) {
            $this->command->warn("Image download failed for car #{$car->id}: {$e->getMessage()}");
        }
    }
}
