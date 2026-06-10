<?php

namespace App\Enums;

enum CarCondition: string
{
    case New  = 'new';
    case Used = 'used';

    public function label(): string
    {
        return match($this) {
            self::New  => 'New',
            self::Used => 'Used',
        };
    }
}
