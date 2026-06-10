import { Link } from '@inertiajs/react';
import { Car } from '@/types';
import { Badge } from '@/components/ui/badge';
import cars from '@/routes/cars';

interface Props {
    car: Car;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

function formatMileage(mileage: number): string {
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
}

export default function CarCard({ car }: Props) {
    const image = car.primary_image ?? car.images?.[0];
    const imgSrc = image ? `/storage/${image.path}` : null;

    return (
        <Link href={cars.show({ car: car.id })} className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={`${car.year} ${car.make?.name} ${car.car_model?.name}`}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2v-4" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="capitalize">{car.condition}</Badge>
                </div>
            </div>

            <div className="p-4">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(car.price)}</p>
                <h3 className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                    {car.year} {car.make?.name} {car.car_model?.name}
                </h3>
                <div className="my-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-sm">{car.body_type}</span>
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-sm">{car.transmission}</span>
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-sm">{car.fuel_type}</span>
                </div>
                <hr />
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {car.city}{car.state ? `, ${car.state}` : ''}
                </p>
            </div>
        </Link>
    );
}
