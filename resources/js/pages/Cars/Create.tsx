import { Head, Link } from '@inertiajs/react';
import { FilterOptions, Make } from '@/types';
import CarForm from '@/components/CarForm';
import cars from '@/routes/cars';

interface Props {
    makes: Make[];
    options: FilterOptions;
}

export default function CarCreate({ makes, options }: Props) {
    return (
        <>
            <Head title="Post Your Car — AutoDive" />

            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-600">AutoDive</Link>
                    <Link href={cars.index()} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300">← Browse</Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post Your Car for Sale</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Free listing — buyers contact you directly.</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                    <CarForm
                        makes={makes}
                        options={options}
                        action={cars.store()}
                        method="post"
                    />
                </div>
            </main>
        </>
    );
}
