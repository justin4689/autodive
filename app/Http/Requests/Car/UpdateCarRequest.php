<?php

namespace App\Http\Requests\Car;

use App\Enums\BodyType;
use App\Enums\CarCondition;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\Transmission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make_id'       => ['sometimes', 'integer', 'exists:makes,id'],
            'car_model_id'  => ['sometimes', 'integer', 'exists:car_models,id'],
            'year'          => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'price'         => ['sometimes', 'integer', 'min:1', 'max:99999999'],
            'mileage'       => ['nullable', 'integer', 'min:0'],
            'fuel_type'     => ['sometimes', new Enum(FuelType::class)],
            'body_type'     => ['sometimes', new Enum(BodyType::class)],
            'transmission'  => ['sometimes', new Enum(Transmission::class)],
            'condition'     => ['sometimes', new Enum(CarCondition::class)],
            'status'        => ['sometimes', new Enum(CarStatus::class)],
            'color'         => ['nullable', 'string', 'max:50'],
            'description'   => ['nullable', 'string', 'max:5000'],
            'city'          => ['sometimes', 'string', 'max:100'],
            'state'         => ['nullable', 'string', 'max:100'],
            'country'       => ['sometimes', 'string', 'size:2'],
        ];
    }
}
