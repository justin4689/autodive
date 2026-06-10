import { Head, Link, router } from '@inertiajs/react';
import { Car } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import cars from '@/routes/cars';
import { dashboard } from '@/routes';

interface Stats {
    total: number;
    active: number;
    sold: number;
    draft: number;
}

interface Props {
    listings: Car[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

const STATUS_BADGE: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    sold: 'secondary',
    draft: 'outline',
};

export default function Dashboard({ listings, stats }: Props) {
    function markSold(car: Car) {
        router.put(cars.update({ car: car.id }), { status: 'sold' }, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard — AutoDive" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total Listings', value: stats.total, color: 'text-gray-900 dark:text-white' },
                        { label: 'Active', value: stats.active, color: 'text-green-600' },
                        { label: 'Sold', value: stats.sold, color: 'text-blue-600' },
                        { label: 'Draft', value: stats.draft, color: 'text-gray-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-sidebar-border/70 bg-white p-5 dark:bg-sidebar dark:border-sidebar-border">
                            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Listings table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:bg-sidebar dark:border-sidebar-border">
                    <div className="flex items-center justify-between border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold text-gray-900 dark:text-white">My Listings</h2>
                        <Link href={cars.create()}>
                            <Button size="sm">+ New Listing</Button>
                        </Link>
                    </div>

                    {listings.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-gray-400">
                            <p className="font-medium">No listings yet</p>
                            <Link href={cars.create()} className="mt-3 text-sm text-blue-600 hover:underline">
                                Post your first car
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {listings.map(car => {
                                const img = car.primary_image;
                                return (
                                    <div key={car.id} className="flex items-center gap-4 px-5 py-4">
                                        {/* Thumbnail */}
                                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                            {img ? (
                                                <img src={`/storage/${img.path}`} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-gray-900 dark:text-white">
                                                {car.year} {car.make?.name} {car.car_model?.name}
                                            </p>
                                            <p className="text-sm font-semibold text-blue-600">{formatPrice(car.price)}</p>
                                            <p className="text-xs text-gray-400">{car.city}{car.state ? `, ${car.state}` : ''}</p>
                                        </div>

                                        {/* Status */}
                                        <Badge variant={STATUS_BADGE[car.status] ?? 'outline'} className="shrink-0 capitalize">
                                            {car.status}
                                        </Badge>

                                        {/* Actions */}
                                        <div className="flex shrink-0 gap-2">
                                            <Link href={cars.show({ car: car.id })}>
                                                <Button variant="outline" size="sm">View</Button>
                                            </Link>
                                            <Link href={cars.edit({ car: car.id })}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            {car.status === 'active' && (
                                                <Button variant="secondary" size="sm" onClick={() => markSold(car)}>
                                                    Mark Sold
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
