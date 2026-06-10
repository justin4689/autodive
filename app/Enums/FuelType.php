<?php

namespace App\Enums;

enum FuelType: string
{
    case Gasoline = 'gasoline';
    case Diesel   = 'diesel';
    case Electric = 'electric';
    case Hybrid   = 'hybrid';

    public function label(): string
    {
        return match($this) {
            self::Gasoline => 'Gasoline',
            self::Diesel   => 'Diesel',
            self::Electric => 'Electric',
            self::Hybrid   => 'Hybrid',
        };
    }
}
