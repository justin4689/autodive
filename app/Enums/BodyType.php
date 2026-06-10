<?php

namespace App\Enums;

enum BodyType: string
{
    case Sedan     = 'sedan';
    case Suv       = 'suv';
    case Pickup    = 'pickup';
    case Coupe     = 'coupe';
    case Hatchback = 'hatchback';
    case Van       = 'van';

    public function label(): string
    {
        return match($this) {
            self::Sedan     => 'Sedan',
            self::Suv       => 'SUV',
            self::Pickup    => 'Pickup Truck',
            self::Coupe     => 'Coupe',
            self::Hatchback => 'Hatchback',
            self::Van       => 'Van',
        };
    }
}
