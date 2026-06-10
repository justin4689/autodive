<?php

namespace App\Services;

use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CarImageService
{
    private const DISK = 'public';
    private const DIRECTORY = 'cars';
    private const MAX_IMAGES = 10;

    public function storeImages(Car $car, array $files): void
    {
        $existing = $car->images()->count();
        $files = array_slice($files, 0, self::MAX_IMAGES - $existing);

        foreach ($files as $index => $file) {
            /** @var UploadedFile $file */
            $path = $file->store(self::DIRECTORY, self::DISK);

            CarImage::create([
                'car_id'     => $car->id,
                'path'       => $path,
                'order'      => $existing + $index,
                'is_primary' => $existing === 0 && $index === 0,
            ]);
        }
    }

    public function deleteImage(CarImage $image): void
    {
        Storage::disk(self::DISK)->delete($image->path);
        $wasPrimary = $image->is_primary;
        $carId = $image->car_id;
        $image->delete();

        if ($wasPrimary) {
            CarImage::where('car_id', $carId)->oldest('order')->first()?->update(['is_primary' => true]);
        }

        $this->reorder($carId);
    }

    public function deleteAllImages(Car $car): void
    {
        foreach ($car->images as $image) {
            Storage::disk(self::DISK)->delete($image->path);
        }
        $car->images()->delete();
    }

    public function setPrimary(Car $car, int $imageId): void
    {
        $car->images()->update(['is_primary' => false]);
        $car->images()->where('id', $imageId)->update(['is_primary' => true]);
    }

    private function reorder(int $carId): void
    {
        CarImage::where('car_id', $carId)
            ->orderBy('order')
            ->get()
            ->each(fn ($img, $i) => $img->update(['order' => $i]));
    }
}
