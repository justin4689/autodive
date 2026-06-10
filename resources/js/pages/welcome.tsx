import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car, Make } from '@/types';
import CarCard from '@/components/CarCard';
import cars from '@/routes/cars';
import { login, register } from '@/routes';
import {  CarFront } from "lucide-react";
interface Props {
    featured: Car[];
    makes: Make[];
    auth: { user: { id: number; name: string } | null };
}

const BODY_TYPES = [
    { value: 'sedan',     label: 'Sedan' },
    { value: 'suv',       label: 'SUV' },
    { value: 'pickup',    label: 'Pickup Truck' },
    { value: 'coupe',     label: 'Coupe' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'van',       label: 'Van' },
];

const FUEL_TYPES = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel',   label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid',   label: 'Hybrid' },
];

function CarIllustration() {
    return (
        <svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
            <ellipse cx="260" cy="218" rx="200" ry="10" fill="rgba(0,0,0,0.12)" />
            {/* Body */}
            <rect x="30" y="125" width="460" height="72" rx="14" fill="white" />
            {/* Roof */}
            <path d="M 110 125 L 148 62 L 372 62 L 410 125 Z" fill="white" />
            {/* Front glass */}
            <path d="M 152 120 L 162 70 L 248 70 L 248 120 Z" fill="#fed7aa" opacity="0.7" />
            {/* Rear glass */}
            <path d="M 272 120 L 272 70 L 360 70 L 368 120 Z" fill="#fed7aa" opacity="0.7" />
            {/* Center pillar */}
            <rect x="252" y="70" width="16" height="50" fill="white" />
            {/* Body accent line */}
            <line x1="35" y1="158" x2="485" y2="158" stroke="#f97316" strokeWidth="2.5" opacity="0.4" />
            {/* Headlight */}
            <rect x="468" y="130" width="22" height="20" rx="6" fill="#fef3c7" />
            <rect x="470" y="133" width="18" height="7" rx="2" fill="#f59e0b" opacity="0.7" />
            {/* Tail light */}
            <rect x="30" y="130" width="18" height="20" rx="6" fill="#fecaca" />
            {/* Grille */}
            <rect x="470" y="158" width="22" height="22" rx="4" fill="#e5e7eb" />
            <rect x="473" y="162" width="16" height="3" rx="1" fill="#9ca3af" />
            <rect x="473" y="168" width="16" height="3" rx="1" fill="#9ca3af" />
            <rect x="473" y="174" width="16" height="3" rx="1" fill="#9ca3af" />
            {/* Front wheel */}
            <circle cx="390" cy="197" r="36" fill="#1c1917" />
            <circle cx="390" cy="197" r="24" fill="#44403c" />
            <circle cx="390" cy="197" r="12" fill="#1c1917" />
            <line x1="390" y1="173" x2="390" y2="197" stroke="#78716c" strokeWidth="3" />
            <line x1="390" y1="197" x2="390" y2="221" stroke="#78716c" strokeWidth="3" />
            <line x1="366" y1="197" x2="390" y2="197" stroke="#78716c" strokeWidth="3" />
            <line x1="390" y1="197" x2="414" y2="197" stroke="#78716c" strokeWidth="3" />
            {/* Rear wheel */}
            <circle cx="130" cy="197" r="36" fill="#1c1917" />
            <circle cx="130" cy="197" r="24" fill="#44403c" />
            <circle cx="130" cy="197" r="12" fill="#1c1917" />
            <line x1="130" y1="173" x2="130" y2="197" stroke="#78716c" strokeWidth="3" />
            <line x1="130" y1="197" x2="130" y2="221" stroke="#78716c" strokeWidth="3" />
            <line x1="106" y1="197" x2="130" y2="197" stroke="#78716c" strokeWidth="3" />
            <line x1="130" y1="197" x2="154" y2="197" stroke="#78716c" strokeWidth="3" />
            {/* Door handles */}
            <rect x="310" y="152" width="26" height="7" rx="3.5" fill="#e5e7eb" />
            <rect x="188" y="152" width="26" height="7" rx="3.5" fill="#e5e7eb" />
            {/* Orange badge */}
            <rect x="440" y="108" width="60" height="22" rx="11" fill="#f97316" />
            <text x="470" y="123" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">AutoDive</text>
        </svg>
    );
}

export default function Welcome({ featured, makes }: Props) {
    const { auth } = usePage<{ auth: Props['auth'] }>().props;
    const [form, setForm] = useState({ make_id: '', car_model_id: '', body_type: '', fuel_type: '' });

    const selectedMake = makes.find(m => m.id.toString() === form.make_id);
    const models       = selectedMake?.car_models ?? [];

    function handleMakeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setForm(prev => ({ ...prev, make_id: e.target.value, car_model_id: '' }));
    }

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.get(cars.index(), form as Record<string, string>, { preserveState: false });
    }

    function handleReset() {
        setForm({ make_id: '', car_model_id: '', body_type: '', fuel_type: '' });
    }

    return (
        <>
            <Head title="AutoDive — Buy & Sell Cars" />

            {/* ─── Navbar ─────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-orange-500">
                        Auto<span className="text-gray-900">Dive</span>
                        <CarFront className="inline-block w-6 h-6 ml-1 text-orange-500" />
                        
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href={cars.index()} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                            Browse Cars
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href={cars.create()}
                                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
                                >
                                    + Add Listing
                                </Link>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={register()} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                                    Sign up
                                </Link>
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ─── Hero ───────────────────────────────────────────────── */}
            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
                    {/* Left */}
                    <div>
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                            #1 Car Marketplace
                        </span>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                            Buy{' '}
                            <span className="text-orange-500">The Best Vehicles</span>
                            <br />
                            in your region
                        </h1>
                        <p className="mt-4 max-w-md text-lg text-gray-500">
                            Thousands of listings from private sellers near you. Contact directly — no fees, no middleman.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={cars.index()}
                                className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
                            >
                                Find the car
                            </Link>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="rounded-lg border-2 border-orange-500 px-8 py-3 font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
                            >
                                Sell your car
                            </Link>
                        </div>
                        {/* Trust badges */}
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Free to list
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Direct contact
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                {makes.length}+ brands
                            </span>
                        </div>
                    </div>
                    {/* Right */}
                    <div className="hidden justify-center md:flex">
                        <CarIllustration />
                    </div>
                </div>
            </section>

            {/* ─── Search panel ───────────────────────────────────────── */}
            <section className="border-y border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-wrap items-end gap-3">

                            <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Maker</label>
                                <select
                                    value={form.make_id}
                                    onChange={handleMakeChange}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                                >
                                    <option value="">All Makers</option>
                                    {makes.map(make => (
                                        <option key={make.id} value={make.id}>{make.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Model</label>
                                <select
                                    value={form.car_model_id}
                                    onChange={e => setForm(prev => ({ ...prev, car_model_id: e.target.value }))}
                                    disabled={models.length === 0}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">All Models</option>
                                    {models.map(model => (
                                        <option key={model.id} value={model.id}>{model.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Type</label>
                                <select
                                    value={form.body_type}
                                    onChange={e => setForm(prev => ({ ...prev, body_type: e.target.value }))}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                                >
                                    <option value="">All Types</option>
                                    {BODY_TYPES.map(bt => (
                                        <option key={bt.value} value={bt.value}>{bt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Fuel Type</label>
                                <select
                                    value={form.fuel_type}
                                    onChange={e => setForm(prev => ({ ...prev, fuel_type: e.target.value }))}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                                >
                                    <option value="">All Fuels</option>
                                    {FUEL_TYPES.map(ft => (
                                        <option key={ft.value} value={ft.value}>{ft.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pb-0.5">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors focus:outline-none"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* ─── Sell your car ──────────────────────────────────────── */}
            <section className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-10 shadow-lg md:flex-row">
                        <div className="text-white">
                            <h2 className="text-2xl font-extrabold">
                                Do you want to sell your car?
                            </h2>
                            <p className="mt-2 max-w-lg text-orange-100">
                                Post a free listing in minutes and reach thousands of buyers in your region. No commission, no fees.
                            </p>
                        </div>
                        <Link
                            href={auth.user ? cars.create() : register()}
                            className="shrink-0 rounded-xl bg-white px-8 py-3 font-semibold text-orange-600 shadow-md hover:bg-orange-50 transition-colors"
                        >
                            Add Your Car →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Latest listings ────────────────────────────────────── */}
            <main className="bg-gray-50 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Latest Added Cars</h2>
                            <p className="mt-1 text-sm text-gray-400">Fresh listings from sellers near you</p>
                        </div>
                        <Link href={cars.index()} className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                            View all →
                        </Link>
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featured.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2v-4" />
                            </svg>
                            <p className="text-lg font-medium text-gray-500">No listings yet</p>
                            <p className="mt-1 text-sm">Be the first to post a car for sale!</p>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="mt-6 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                            >
                                {auth.user ? 'Post your car' : 'Sign up to sell'}
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* ─── Footer ─────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 bg-white py-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()}{' '}
                <span className="font-semibold text-orange-500">Auto</span>
                <span className="font-semibold text-gray-700">Dive</span>
                . All rights reserved.
            </footer>
        </>
    );
}
