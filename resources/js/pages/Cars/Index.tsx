import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Car, CarFilters, FilterOptions, Make, Pagination } from '@/types';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import cars from '@/routes/cars';
import { login } from '@/routes';

interface Props {
    cars: Pagination<Car>;
    filters: CarFilters;
    options: FilterOptions;
    makes: Make[];
    auth?: { user: { id: number } | null };
}

const SORT_OPTIONS = [
    { value: 'latest', label: 'Most Recent' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'year_desc', label: 'Year: Newest' },
    { value: 'mileage_asc', label: 'Lowest Mileage' },
];

export default function CarsIndex({ cars, filters, options, makes }: Props) {
    const [form, setForm] = useState<CarFilters>(filters);

    function set(key: keyof CarFilters, value: string) {
        const updated = { ...form, [key]: value || undefined };
        if (key === 'make_id') updated.car_model_id = undefined;
        setForm(updated);
    }

    function apply(e: React.FormEvent) {
        e.preventDefault();
        router.get(cars.index(), form as Record<string, string>, { preserveState: true, replace: true });
    }

    function clear() {
        setForm({});
        router.get(cars.index(), {}, { preserveState: false });
    }

    const selectedMake = makes.find(m => String(m.id) === String(form.make_id));
    const models = selectedMake?.car_models ?? [];

    return (
        <>
            <Head title="Browse Cars — AutoDive" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-600">AutoDive</Link>
                    <Link href={cars.create()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + Sell Your Car
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Sidebar filters */}
                    <aside className="w-full shrink-0 lg:w-64">
                        <form onSubmit={apply} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                            <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Filter</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Make</label>
                                    <Select value={form.make_id ?? ''} onValueChange={v => set('make_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="All Makes" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Makes</SelectItem>
                                            {makes.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {models.length > 0 && (
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Model</label>
                                        <Select value={form.car_model_id ?? ''} onValueChange={v => set('car_model_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="All Models" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All Models</SelectItem>
                                                {models.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Year Min</label>
                                        <Input type="number" placeholder="2000" value={form.year_min ?? ''} onChange={e => set('year_min', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Year Max</label>
                                        <Input type="number" placeholder={String(new Date().getFullYear())} value={form.year_max ?? ''} onChange={e => set('year_max', e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Price Min ($)</label>
                                        <Input type="number" placeholder="0" value={form.price_min ?? ''} onChange={e => set('price_min', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Price Max ($)</label>
                                        <Input type="number" placeholder="Any" value={form.price_max ?? ''} onChange={e => set('price_max', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Max Mileage</label>
                                    <Input type="number" placeholder="Any" value={form.mileage_max ?? ''} onChange={e => set('mileage_max', e.target.value)} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Body Type</label>
                                    <Select value={form.body_type ?? ''} onValueChange={v => set('body_type', v)}>
                                        <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any</SelectItem>
                                            {options.body_types.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Fuel Type</label>
                                    <Select value={form.fuel_type ?? ''} onValueChange={v => set('fuel_type', v)}>
                                        <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any</SelectItem>
                                            {options.fuel_types.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Transmission</label>
                                    <Select value={form.transmission ?? ''} onValueChange={v => set('transmission', v)}>
                                        <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any</SelectItem>
                                            {options.transmissions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Condition</label>
                                    <Select value={form.condition ?? ''} onValueChange={v => set('condition', v)}>
                                        <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any</SelectItem>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">City</label>
                                    <Input placeholder="e.g. Los Angeles" value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button type="submit" className="flex-1">Apply</Button>
                                <Button type="button" variant="outline" onClick={clear}>Clear</Button>
                            </div>
                        </form>
                    </aside>

                    {/* Results */}
                    <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {cars.total} {cars.total === 1 ? 'result' : 'results'}
                            </p>
                            <Select value={form.sort ?? ''} onValueChange={v => {
                                const updated = { ...form, sort: v || undefined };
                                setForm(updated);
                                router.get(cars.index(), updated as Record<string, string>, { preserveState: true, replace: true });
                            }}>
                                <SelectTrigger className="w-48"><SelectValue placeholder="Sort by" /></SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {cars.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {cars.data.map(car => <CarCard key={car.id} car={car} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-gray-400 dark:border-gray-700">
                                <p className="text-lg font-medium">No cars found</p>
                                <p className="mt-1 text-sm">Try adjusting your filters</p>
                                <button onClick={clear} className="mt-4 text-sm text-blue-600 hover:underline">Clear all filters</button>
                            </div>
                        )}

                        {/* Pagination */}
                        {cars.last_page > 1 && (
                            <div className="mt-8 flex justify-center gap-1">
                                {cars.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`min-w-[2.5rem] rounded-md px-3 py-2 text-center text-sm ${link.active ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="min-w-[2.5rem] rounded-md px-3 py-2 text-center text-sm text-gray-400"
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
