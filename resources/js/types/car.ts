export interface Make {
    id: number;
    name: string;
    slug: string;
    car_models?: CarModel[];
}

export interface CarModel {
    id: number;
    make_id: number;
    name: string;
    slug: string;
}

export interface CarImage {
    id: number;
    car_id: number;
    path: string;
    order: number;
    is_primary: boolean;
}

export interface Car {
    id: number;
    user_id: number;
    make_id: number;
    car_model_id: number;
    year: number;
    price: number;
    mileage: number;
    fuel_type: string;
    body_type: string;
    transmission: string;
    condition: string;
    color: string | null;
    description: string | null;
    city: string;
    state: string | null;
    country: string;
    status: string;
    created_at: string;
    updated_at: string;
    make?: Make;
    car_model?: CarModel;
    images?: CarImage[];
    primary_image?: CarImage | null;
    user?: { id: number; name: string };
}

export interface EnumOption {
    value: string;
    label: string;
}

export interface FilterOptions {
    fuel_types: EnumOption[];
    body_types: EnumOption[];
    transmissions: EnumOption[];
}

export interface CarFilters {
    make_id?: string;
    car_model_id?: string;
    year_min?: string;
    year_max?: string;
    price_min?: string;
    price_max?: string;
    mileage_max?: string;
    fuel_type?: string;
    body_type?: string;
    transmission?: string;
    condition?: string;
    city?: string;
    state?: string;
    sort?: string;
}

export interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}
