<?php

namespace App\Http\Requests\Car;

use App\Enums\BodyType;
use App\Enums\CarCondition;
use App\Enums\FuelType;
use App\Enums\Transmission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make_id'       => ['required', 'integer', 'exists:makes,id'],
            'car_model_id'  => ['required', 'integer', 'exists:car_models,id'],
            'year'          => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'price'         => ['required', 'integer', 'min:1', 'max:99999999'],
            'mileage'       => ['nullable', 'integer', 'min:0'],
            'fuel_type'     => ['required', new Enum(FuelType::class)],
            'body_type'     => ['required', new Enum(BodyType::class)],
            'transmission'  => ['required', new Enum(Transmission::class)],
            'condition'     => ['required', new Enum(CarCondition::class)],
            'color'         => ['nullable', 'string', 'max:50'],
            'description'   => ['nullable', 'string', 'max:5000'],
            'city'          => ['required', 'string', 'max:100'],
            'state'         => ['nullable', 'string', 'max:100'],
            'country'       => ['required', 'string', 'size:2'],
            'images'        => ['nullable', 'array', 'max:10'],
            'images.*'      => ['image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }
}
