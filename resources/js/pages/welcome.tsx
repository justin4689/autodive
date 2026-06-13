import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car, Make } from '@/types';
import CarCard from '@/components/CarCard';
import cars from '@/routes/cars';
import { login, register } from '@/routes';
import {
    CarFront, Truck, Car as CarIcon, Search,
    MessageCircle, CheckCircle, Camera, ShieldCheck,
    ChevronRight, ListFilter,
} from 'lucide-react';

interface Props {
    featured: Car[];
    makes: Make[];
    auth: { user: { id: number; name: string } | null };
}

const BODY_TYPES = [
    { value: 'sedan',     label: 'Sedan',     Icon: CarIcon },
    { value: 'suv',       label: 'SUV',        Icon: Truck   },
    { value: 'pickup',    label: 'Pickup',     Icon: Truck   },
    { value: 'coupe',     label: 'Coupe',      Icon: CarFront},
    { value: 'hatchback', label: 'Hatchback',  Icon: CarIcon },
    { value: 'van',       label: 'Van',        Icon: Truck   },
];

const FUEL_TYPES = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel',   label: 'Diesel'   },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid',   label: 'Hybrid'   },
];

const HOW_IT_WORKS = [
    { step: '1', Icon: Camera,        title: 'List your car',   desc: 'Create a free listing in minutes. Add photos, price and specs.' },
    { step: '2', Icon: MessageCircle, title: 'Get contacted',   desc: 'Buyers reach out directly. No middleman, no commission fees.' },
    { step: '3', Icon: CheckCircle,   title: 'Close the deal',  desc: 'Meet the buyer, hand over the keys and get paid on your terms.' },
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
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
        >
            <div className="flex h-10 w-20 items-center justify-center overflow-hidden">
                {failed ? (
                    <span className="text-sm font-bold text-slate-400">{make.name}</span>
                ) : (
                    <img
                        src={src}
                        alt={make.name}
                        className="h-full w-full object-contain grayscale transition-all duration-200 group-hover:grayscale-0"
                        onError={handleError}
                    />
                )}
            </div>
            <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-orange-500">
                {make.name}
            </span>
        </button>
    );
}

export default function Welcome({ featured, makes }: Props) {
    const { auth } = usePage<{ auth: Props['auth'] }>().props;
    const [form, setForm] = useState({ make_id: '', car_model_id: '', body_type: '', fuel_type: '' });
    const [searchOpen, setSearchOpen] = useState(false);

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

    const selectClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400";

    return (
        <>
            <Head title="AutoDive — Buy & Sell Cars" />

            {/* ── Navbar ────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-slate-900 shadow-lg">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                        <CarFront className="h-5 w-5 text-orange-500" />
                        <span className="text-white">Auto</span><span className="text-orange-500">Dive</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href={cars.index()} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                            Browse Cars
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                                    Dashboard
                                </Link>
                                <Link
                                    href={cars.create()}
                                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                                >
                                    + Sell a Car
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={login()} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                                    Login
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                                >
                                    Sign up — it's free
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="bg-white pb-12 pt-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">

                    {/* Text */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            #1 Car Marketplace
                        </div>
                        <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
                            Find your<br />
                            <span className="text-orange-500">perfect car</span><br />
                            nearby
                        </h1>
                        <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-500">
                            Thousands of listings from private sellers near you. Contact directly — no fees, no middlemen.
                        </p>

                        {/* Quick search */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={cars.index()}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                            >
                                <Search className="h-4 w-4" />
                                Browse listings
                            </Link>
                            <button
                                onClick={() => setSearchOpen(v => !v)}
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                            >
                                <ListFilter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>

                        {/* Trust pills */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            {[
                                { Icon: ShieldCheck, text: 'Free to list' },
                                { Icon: MessageCircle, text: 'Direct contact' },
                                { Icon: CarIcon, text: `${makes.length} brands` },
                            ].map(({ Icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <Icon className="h-4 w-4 text-slate-300" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Photo */}
                    <div className="hidden md:block">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
                                alt="Featured car"
                                className="h-[460px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                                <div className="rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500">Available now</p>
                                    <p className="text-sm font-bold text-slate-900">27 cars listed</p>
                                </div>
                                <div className="rounded-xl bg-orange-500 px-4 py-2.5 shadow-lg">
                                    <p className="text-xs font-medium text-orange-100">Starting at</p>
                                    <p className="text-sm font-bold text-white">$22,500</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable filter panel */}
                {searchOpen && (
                    <div className="mx-auto mt-8 max-w-7xl px-6">
                        <form onSubmit={handleSearch} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Maker</label>
                                    <select value={form.make_id} onChange={handleMakeChange} className={selectClass}>
                                        <option value="">All Makers</option>
                                        {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model</label>
                                    <select value={form.car_model_id} onChange={e => setForm(p => ({ ...p, car_model_id: e.target.value }))} disabled={!models.length} className={selectClass}>
                                        <option value="">All Models</option>
                                        {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Type</label>
                                    <select value={form.body_type} onChange={e => setForm(p => ({ ...p, body_type: e.target.value }))} className={selectClass}>
                                        <option value="">All Types</option>
                                        {BODY_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fuel</label>
                                    <select value={form.fuel_type} onChange={e => setForm(p => ({ ...p, fuel_type: e.target.value }))} className={selectClass}>
                                        <option value="">All Fuels</option>
                                        {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button type="submit" className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                                    <Search className="h-4 w-4" /> Search
                                </button>
                                <button type="button" onClick={handleReset} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-white">
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </section>

            {/* ── Browse by category ────────────────────────────────── */}
            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Browse by type</h2>
                            <p className="mt-1 text-sm text-slate-400">Find the body style that suits you</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                        {BODY_TYPES.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                onClick={() => router.get(cars.index(), { body_type: value }, { preserveState: false })}
                                className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:ring-orange-300 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-orange-50">
                                    <Icon className="h-6 w-6 text-slate-400 transition-colors group-hover:text-orange-500" />
                                </div>
                                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────── */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
                        <p className="mt-2 text-sm text-slate-400">Sell your car in 3 simple steps — totally free</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {HOW_IT_WORKS.map(({ step, Icon, title, desc }, i) => (
                            <div key={step} className="relative flex gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="shrink-0">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-base font-extrabold text-white">
                                        {step}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
                                </div>
                                {i < 2 && (
                                    <ChevronRight className="absolute -right-3.5 top-1/2 hidden -translate-y-1/2 h-7 w-7 text-slate-200 md:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Popular brands ────────────────────────────────────── */}
            <section className="bg-slate-50 py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Popular brands</h2>
                        <p className="mt-1 text-sm text-slate-400">Browse by manufacturer</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                        {makes.map(make => (
                            <BrandCard
                                key={make.id}
                                make={make}
                                onSelect={() => router.get(cars.index(), { make_id: String(make.id) }, { preserveState: false })}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Sell banner ───────────────────────────────────────── */}
            <section className="bg-slate-900 py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">For sellers</p>
                            <h2 className="mt-2 text-3xl font-extrabold text-white">
                                Ready to sell your car?
                            </h2>
                            <p className="mt-3 max-w-lg text-slate-400">
                                Post a free listing in minutes and reach thousands of buyers in your region. No commission, no fees, ever.
                            </p>
                        </div>
                        <Link
                            href={auth.user ? cars.create() : register()}
                            className="shrink-0 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-400"
                        >
                            List your car — free →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Latest listings ───────────────────────────────────── */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Latest listings</h2>
                            <p className="mt-1 text-sm text-slate-400">Fresh from sellers near you</p>
                        </div>
                        <Link href={cars.index()} className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
                            View all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {featured.map(car => <CarCard key={car.id} car={car} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-slate-400">
                            <CarIcon className="mb-4 h-12 w-12 text-slate-300" />
                            <p className="font-semibold text-slate-500">No listings yet</p>
                            <p className="mt-1 text-sm">Be the first to post a car for sale</p>
                            <Link
                                href={auth.user ? cars.create() : register()}
                                className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                            >
                                {auth.user ? 'Post your car' : 'Sign up to sell'}
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="bg-slate-900 pt-10 pb-8">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
                            <CarFront className="h-4 w-4 text-orange-500" />
                            <span className="text-white">Auto</span><span className="text-orange-500">Dive</span>
                        </Link>
                        <div className="flex gap-8 text-sm text-slate-400">
                            <Link href={cars.index()} className="hover:text-white">Browse</Link>
                            <Link href={auth.user ? cars.create() : register()} className="hover:text-white">Sell</Link>
                            <Link href={login()} className="hover:text-white">Login</Link>
                        </div>
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} AutoDive
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
