import { useForm } from '@inertiajs/react';
import { Car, FilterOptions, Make } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Props {
    car?: Car;
    makes: Make[];
    options: FilterOptions;
    action: string;
    method?: 'post' | 'put';
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR + 1 - i);

const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
];

export default function CarForm({ car, makes, options, action, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        make_id: car?.make_id ? String(car.make_id) : '',
        car_model_id: car?.car_model_id ? String(car.car_model_id) : '',
        year: car?.year ? String(car.year) : '',
        price: car?.price ? String(car.price) : '',
        mileage: car?.mileage ? String(car.mileage) : '0',
        fuel_type: car?.fuel_type ?? '',
        body_type: car?.body_type ?? '',
        transmission: car?.transmission ?? '',
        condition: car?.condition ?? '',
        color: car?.color ?? '',
        description: car?.description ?? '',
        city: car?.city ?? '',
        state: car?.state ?? '',
        country: car?.country ?? 'US',
        images: [] as File[],
    });

    const selectedMake = makes.find(m => String(m.id) === data.make_id);
    const models = selectedMake?.car_models ?? [];

    function handleMakeChange(value: string) {
        setData(prev => ({ ...prev, make_id: value, car_model_id: '' }));
    }

    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setData('images', files as unknown as File[]);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (method === 'put') {
            put(action);
        } else {
            post(action);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Make & Model */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label>Make *</Label>
                    <Select value={data.make_id} onValueChange={handleMakeChange}>
                        <SelectTrigger><SelectValue placeholder="Select make" /></SelectTrigger>
                        <SelectContent>
                            {makes.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.make_id} />
                </div>
                <div className="space-y-1">
                    <Label>Model *</Label>
                    <Select value={data.car_model_id} onValueChange={v => setData('car_model_id', v)} disabled={!models.length}>
                        <SelectTrigger><SelectValue placeholder={data.make_id ? 'Select model' : 'Select make first'} /></SelectTrigger>
                        <SelectContent>
                            {models.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.car_model_id} />
                </div>
            </div>

            {/* Year & Price & Mileage */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                    <Label>Year *</Label>
                    <Select value={data.year} onValueChange={v => setData('year', v)}>
                        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                        <SelectContent>
                            {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.year} />
                </div>
                <div className="space-y-1">
                    <Label>Price ($) *</Label>
                    <Input type="number" min="1" placeholder="e.g. 15000" value={data.price} onChange={e => setData('price', e.target.value)} />
                    <InputError message={errors.price} />
                </div>
                <div className="space-y-1">
                    <Label>Mileage</Label>
                    <Input type="number" min="0" placeholder="0" value={data.mileage} onChange={e => setData('mileage', e.target.value)} />
                    <InputError message={errors.mileage} />
                </div>
            </div>

            {/* Fuel / Body / Transmission / Condition */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                    <Label>Fuel *</Label>
                    <Select value={data.fuel_type} onValueChange={v => setData('fuel_type', v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            {options.fuel_types.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.fuel_type} />
                </div>
                <div className="space-y-1">
                    <Label>Body *</Label>
                    <Select value={data.body_type} onValueChange={v => setData('body_type', v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            {options.body_types.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.body_type} />
                </div>
                <div className="space-y-1">
                    <Label>Transmission *</Label>
                    <Select value={data.transmission} onValueChange={v => setData('transmission', v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            {options.transmissions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.transmission} />
                </div>
                <div className="space-y-1">
                    <Label>Condition *</Label>
                    <Select value={data.condition} onValueChange={v => setData('condition', v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.condition} />
                </div>
            </div>

            {/* Color */}
            <div className="space-y-1 sm:w-1/3">
                <Label>Color</Label>
                <Input placeholder="e.g. Silver" value={data.color} onChange={e => setData('color', e.target.value)} />
                <InputError message={errors.color} />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                    <Label>City *</Label>
                    <Input placeholder="e.g. Los Angeles" value={data.city} onChange={e => setData('city', e.target.value)} />
                    <InputError message={errors.city} />
                </div>
                <div className="space-y-1">
                    <Label>State / Province</Label>
                    <Input placeholder="e.g. CA" value={data.state} onChange={e => setData('state', e.target.value)} />
                    <InputError message={errors.state} />
                </div>
                <div className="space-y-1">
                    <Label>Country *</Label>
                    <Select value={data.country} onValueChange={v => setData('country', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.country} />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                    rows={5}
                    placeholder="Describe the vehicle condition, history, features..."
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <InputError message={errors.description} />
            </div>

            {/* Images (create only) */}
            {method === 'post' && (
                <div className="space-y-1">
                    <Label>Photos (up to 10)</Label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImages}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                    />
                    <p className="text-xs text-gray-400">JPEG, PNG or WebP. Max 5 MB each.</p>
                </div>
            )}

            <div className="pt-2">
                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                    {processing ? 'Saving...' : car ? 'Save Changes' : 'Publish Listing'}
                </Button>
            </div>
        </form>
    );
}
