<?php

namespace App\Enums;

enum CarStatus: string
{
    case Active = 'active';
    case Sold   = 'sold';
    case Draft  = 'draft';

    public function label(): string
    {
        return match($this) {
            self::Active => 'Active',
            self::Sold   => 'Sold',
            self::Draft  => 'Draft',
        };
    }
}
