'use client'

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        params.set('page', '1'); // Reset to page 1 when sorting changes
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-3">
            <label htmlFor="sort" className="font-bold text-slate-600 hidden sm:block">Sort By:</label>
            <select 
                id="sort"
                className="border-2 border-slate-300 rounded-xl p-2 bg-white cursor-pointer focus:border-red-500 outline-none transition-colors"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={searchParams.get('sort') || ""}
            >
                <option value="">Newest Arrivals</option>
                <option value="price-low">Price: Lowest</option>
                <option value="price-high">Price: Highest</option>
                <option value="alpha">Alphabetical (A-Z)</option>
            </select>
        </div>
    );
}