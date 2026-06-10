import { Head, Link, router } from '@inertiajs/react';
import { Car, FilterOptions, Make } from '@/types';
import CarForm from '@/components/CarForm';
import { Button } from '@/components/ui/button';
import cars from '@/routes/cars';

interface Props {
    car: Car;
    makes: Make[];
    options: FilterOptions;
}

export default function CarEdit({ car, makes, options }: Props) {
    function handleDelete() {
        if (!confirm('Delete this listing? This cannot be undone.')) return;
        router.delete(cars.destroy({ car: car.id }));
    }

    return (
        <>
            <Head title="Edit Listing — AutoDive" />

            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-600">AutoDive</Link>
                    <Link href={cars.show({ car: car.id })} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300">← Back to listing</Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-10">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Listing</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {car.year} {car.make?.name} {car.car_model?.name}
                        </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
                </div>

                {/* Image manager */}
                {(car.images?.length ?? 0) > 0 && (
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                        <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">Photos</h2>
                        <div className="flex flex-wrap gap-3">
                            {car.images?.map(img => (
                                <div key={img.id} className="group relative">
                                    <img
                                        src={`/storage/${img.path}`}
                                        alt=""
                                        className="h-24 w-32 rounded-lg object-cover"
                                    />
                                    {img.is_primary && (
                                        <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white">Primary</span>
                                    )}
                                    <Link
                                        href={cars.images.destroy({ car: car.id, image: img.id })}
                                        method="delete"
                                        as="button"
                                        className="absolute top-1 right-1 hidden rounded bg-red-600 p-1 text-white group-hover:block"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                    <CarForm
                        car={car}
                        makes={makes}
                        options={options}
                        action={cars.update({ car: car.id })}
                        method="put"
                    />
                </div>
            </main>
        </>
    );
}
