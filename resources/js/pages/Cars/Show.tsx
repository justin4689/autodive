import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import cars from '@/routes/cars';

interface Props {
    car: Car;
    auth?: { user: { id: number } | null };
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

function formatMileage(mileage: number) {
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
}

const LABEL_MAP: Record<string, string> = {
    year: 'Year', mileage: 'Mileage', fuel_type: 'Fuel',
    body_type: 'Body', transmission: 'Transmission', condition: 'Condition', color: 'Color',
};

export default function CarShow({ car }: Props) {
    const { auth } = usePage<{ auth: Props['auth'] }>().props;
    const images = car.images ?? [];
    const [active, setActive] = useState(0);

    const isOwner = auth?.user?.id === car.user_id;
    const title = `${car.year} ${car.make?.name} ${car.car_model?.name}`;

    const specs = [
        { label: 'Year', value: String(car.year) },
        { label: 'Mileage', value: formatMileage(car.mileage) },
        { label: 'Fuel', value: car.fuel_type },
        { label: 'Body', value: car.body_type },
        { label: 'Transmission', value: car.transmission },
        { label: 'Condition', value: car.condition },
        ...(car.color ? [{ label: 'Color', value: car.color }] : []),
    ];

    return (
        <>
            <Head title={`${title} — AutoDive`} />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-600">AutoDive</Link>
                    <Link href={cars.index()} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300">← Browse</Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Image gallery — left 2/3 */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                            {images.length > 0 ? (
                                <img
                                    src={`/storage/${images[active].path}`}
                                    alt={title}
                                    className="aspect-[16/10] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[16/10] items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActive(i)}
                                        className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? 'border-blue-600' : 'border-transparent'}`}
                                    >
                                        <img src={`/storage/${img.path}`} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {car.description && (
                            <div className="mt-8">
                                <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Description</h2>
                                <p className="whitespace-pre-line text-gray-600 dark:text-gray-400">{car.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar — right 1/3 */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatPrice(car.price)}</p>
                                    <h1 className="mt-1 text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h1>
                                </div>
                                <Badge variant="secondary" className="capitalize">{car.condition}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                {car.city}{car.state ? `, ${car.state}` : ''}
                            </p>

                            {/* Specs grid */}
                            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-100 pt-5 text-sm dark:border-gray-800">
                                {specs.map(s => (
                                    <div key={s.label}>
                                        <dt className="text-gray-400 dark:text-gray-500">{s.label}</dt>
                                        <dd className="mt-0.5 font-medium capitalize text-gray-800 dark:text-gray-200">{s.value}</dd>
                                    </div>
                                ))}
                            </dl>

                            {/* Contact CTA */}
                            <div className="mt-6">
                                {car.user ? (
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Listed by {car.user.name}
                                        </p>
                                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                                            Contact the seller to arrange viewing or purchase.
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            {/* Owner actions */}
                            {isOwner && (
                                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <Link href={cars.edit({ car: car.id })} className="flex-1">
                                        <Button variant="outline" className="w-full">Edit Listing</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Safety tip */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                            <p className="font-semibold">Safety Tip</p>
                            <p className="mt-1">Meet in a public place and never send money before seeing the vehicle in person.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
