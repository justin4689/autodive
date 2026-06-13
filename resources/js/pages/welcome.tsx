import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car, Make } from '@/types';
import CarCard from '@/components/CarCard';
import cars from '@/routes/cars';
import { login, register } from '@/routes';
import {
    CarFront, Truck, Car as CarIcon, Zap, Search,
    MessageCircle, CheckCircle, Camera, Star, ShieldCheck,
} from 'lucide-react';

interface Props {
    featured: Car[];
    makes: Make[];
    auth: { user: { id: number; name: string } | null };
}

const BODY_TYPES = [
    { value: 'sedan',     label: 'Sedan',        Icon: CarIcon,   bg: 'bg-blue-50',   icon: 'text-blue-500' },
    { value: 'suv',       label: 'SUV',           Icon: Truck,     bg: 'bg-green-50',  icon: 'text-green-500' },
    { value: 'pickup',    label: 'Pickup',         Icon: Truck,     bg: 'bg-yellow-50', icon: 'text-yellow-600' },
    { value: 'coupe',     label: 'Coupe',          Icon: CarFront,  bg: 'bg-purple-50', icon: 'text-purple-500' },
    { value: 'hatchback', label: 'Hatchback',      Icon: CarIcon,   bg: 'bg-pink-50',   icon: 'text-pink-500' },
    { value: 'van',       label: 'Van',            Icon: Truck,     bg: 'bg-orange-50', icon: 'text-orange-500' },
];

const FUEL_TYPES = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel',   label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid',   label: 'Hybrid' },
];

const HOW_IT_WORKS = [
    { step: '01', Icon: Camera,        title: 'List your car',      desc: 'Create a free listing in minutes. Add photos, specs and your price.' },
    { step: '02', Icon: MessageCircle, title: 'Get contacted',      desc: 'Interested buyers reach out directly. No middleman, no commissions.' },
    { step: '03', Icon: CheckCircle,   title: 'Close the deal',     desc: 'Meet the buyer, hand over the keys and get paid on your terms.' },
];

function BrandCard({ make, onSelect }: { make: Make; onSelect: () => void }) {
    const [src, setSrc] = useState(`/images/brands/${make.slug}.png`);
    const [failed, setFailed] = useState(false);

    function handleError() {
        if (src.endsWith('.png')) {
            setSrc(`/images/brands/${make.slug}.svg`);
        } else {
            setFailed(true);
        }
    }

    return (
        <button
            onClick={onSelect}
            className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
        >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                {failed ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                        {make.name.slice(0, 2).toUpperCase()}
                    </div>
                ) : (
                    <img
                        src={src}
                        alt={make.name}
                        className="h-full w-full object-contain"
                        onError={handleError}
                    />
                )}
            </div>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-500">{make.name}</span>
        </button>
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

            {/* ─── Navbar ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
                        <span className="text-orange-500">Auto</span>
                        <span className="text-gray-900">Dive</span>
                        <CarFront className="h-5 w-5 text-orange-500" />
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href={cars.index()} className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500">
                            Browse Cars
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href={cars.create()}
                                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                                >
                                    + Add Listing
                                </Link>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500">
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={register()} className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500">
                                    Sign up
                                </Link>
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ─── Hero ────────────────────────────────────────────────── */}
            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">

                    {/* Left — text */}
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
                                className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600"
                            >
                                Find the car
                            </Link>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="rounded-lg border-2 border-orange-500 px-8 py-3 font-semibold text-orange-500 transition-colors hover:bg-orange-50"
                            >
                                Sell your car
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-400">
                            {[
                                { Icon: ShieldCheck, text: 'Free to list' },
                                { Icon: MessageCircle, text: 'Direct contact' },
                                { Icon: Star, text: `${makes.length}+ brands` },
                            ].map(({ Icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5">
                                    <Icon className="h-4 w-4 text-orange-400" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — real photo */}
                    <div className="hidden md:block">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
                                alt="Featured car"
                                className="h-105 w-full object-cover"
                            />
                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                            {/* badge */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-semibold text-gray-800">27 cars available now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Search panel ────────────────────────────────────────── */}
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
                                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                >
                                    <Search className="h-4 w-4" />
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 focus:outline-none"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* ─── Browse by category ──────────────────────────────────── */}
            <section className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                        <p className="mt-1 text-sm text-gray-400">Find the body type that suits your lifestyle</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {BODY_TYPES.map(({ value, label, Icon, bg, icon }) => (
                            <button
                                key={value}
                                onClick={() => router.get(cars.index(), { body_type: value }, { preserveState: false })}
                                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg} transition-transform group-hover:scale-110`}>
                                    <Icon className={`h-7 w-7 ${icon}`} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-500">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats bar ───────────────────────────────────────────── */}
            <section className="bg-orange-500 py-10">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center text-white sm:grid-cols-4">
                    {[
                        { value: `${featured.length > 0 ? '27+' : '0'}`, label: 'Active Listings' },
                        { value: `${makes.length}`,                       label: 'Car Brands' },
                        { value: '100%',                                   label: 'Free to List' },
                        { value: '0%',                                     label: 'Commission' },
                    ].map(stat => (
                        <div key={stat.label}>
                            <p className="text-3xl font-extrabold">{stat.value}</p>
                            <p className="mt-1 text-sm text-orange-100">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── How it works ────────────────────────────────────────── */}
            <section className="bg-gray-50 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
                        <p className="mt-1 text-sm text-gray-400">Sell your car in 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {HOW_IT_WORKS.map(({ step, Icon, title, desc }) => (
                            <div key={step} className="relative flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm">
                                <span className="absolute -top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                                    {step}
                                </span>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                                    <Icon className="h-8 w-8 text-orange-500" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Popular brands ──────────────────────────────────────── */}
            <section className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Popular Brands</h2>
                        <p className="mt-1 text-sm text-gray-400">Browse by manufacturer</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-8">
                        {makes.map(make => (
                            <BrandCard key={make.id} make={make} onSelect={() =>
                                router.get(cars.index(), { make_id: String(make.id) }, { preserveState: false })
                            } />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Sell your car banner ────────────────────────────────── */}
            <section className="bg-gray-50 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 shadow-lg">
                        {/* background pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                        <div className="relative flex flex-col items-center justify-between gap-6 px-8 py-12 text-white md:flex-row">
                            <div>
                                <h2 className="text-2xl font-extrabold">Do you want to sell your car?</h2>
                                <p className="mt-2 max-w-lg text-orange-100">
                                    Post a free listing in minutes and reach thousands of buyers in your region. No commission, no fees.
                                </p>
                            </div>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="shrink-0 rounded-xl bg-white px-8 py-3 font-semibold text-orange-600 shadow-md transition-colors hover:bg-orange-50"
                            >
                                Add Your Car →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Latest listings ─────────────────────────────────────── */}
            <main className="bg-white py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Latest Added Cars</h2>
                            <p className="mt-1 text-sm text-gray-400">Fresh listings from sellers near you</p>
                        </div>
                        <Link href={cars.index()} className="text-sm font-semibold text-orange-500 hover:underline">
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
                        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-gray-400">
                            <CarIcon className="mb-4 h-16 w-16 text-gray-300" />
                            <p className="text-lg font-medium text-gray-500">No listings yet</p>
                            <p className="mt-1 text-sm">Be the first to post a car for sale!</p>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="mt-6 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                            >
                                {auth.user ? 'Post your car' : 'Sign up to sell'}
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* ─── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 bg-white py-10">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold">
                            <span className="text-orange-500">Auto</span>
                            <span className="text-gray-900">Dive</span>
                            <CarFront className="h-5 w-5 text-orange-500" />
                        </Link>
                        <div className="flex gap-6 text-sm text-gray-400">
                            <Link href={cars.index()} className="hover:text-orange-500">Browse</Link>
                            <Link href={auth.user ? cars.create() : register()} className="hover:text-orange-500">Sell</Link>
                            <Link href={login()} className="hover:text-orange-500">Login</Link>
                        </div>
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} AutoDive. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
