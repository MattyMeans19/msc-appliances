'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';

// 1. Define the shape of a Category from your DB mapping table
interface Category {
  id: number;
  product_type: string;
  subtype: string[]; // This matches your text[] array in Postgres
}

interface InventoryFiltersProps {
  categories: Category[];
}

export default function InventoryFilters({ categories }: InventoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedType, setExpandedType] = useState<string | null>(searchParams.get('type'));

  const selectedType = searchParams.get('type');
  const selectedSubtypes: string[] = searchParams.get('subtypes')?.split(',') || [];

  const updateFilters = (type: string, subtypesArray: string[] = []) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('type', type);
    
    if (subtypesArray.length > 0) {
      params.set('subtypes', subtypesArray.join(','));
    } else {
      params.delete('subtypes');
    }

    params.set('page', '1');
    
    // OPTIMIZATION: scroll: false prevents the jumpy UI
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full md:w-64 p-4 border rounded-xl bg-white shadow-sm sticky top-5">
      <h2 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Filter Items</h2>
      
      {categories.map((cat: Category) => (
        <div key={cat.id} className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                updateFilters(cat.product_type);
                setExpandedType(cat.product_type); // Expand when selected
              }}
              className={`text-left font-medium grow py-1 px-2 rounded-lg transition-colors ${
                selectedType === cat.product_type 
                ? 'bg-red-50 text-red-600' 
                : 'hover:bg-gray-100 text-slate-700'
              }`}
            >
              {cat.product_type}
            </button>
            
            <button 
              onClick={() => setExpandedType(expandedType === cat.product_type ? null : cat.product_type)}
              className="p-1 hover:bg-gray-200 rounded text-slate-400"
            >
              {expandedType === cat.product_type ? '−' : '+'}
            </button>
          </div>

          {/* Subtype Logic stays the same... it works great! */}
          {expandedType === cat.product_type && (
            <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
              {/* Ensure subtypes is an array, fallback to empty array if not */}
              {(Array.isArray(cat.subtype) ? cat.subtype : []).map((sub: string) => (
                <label key={sub} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedType === cat.product_type && selectedSubtypes.includes(sub)}
                    onChange={() => {
                      let newSubtypes = selectedType === cat.product_type ? [...selectedSubtypes] : [];
                      if (newSubtypes.includes(sub)) {
                        newSubtypes = newSubtypes.filter(s => s !== sub);
                      } else {
                        newSubtypes.push(sub);
                      }
                      updateFilters(cat.product_type, newSubtypes);
                    }}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-red-600 transition-colors">
                    {sub}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Reset button with scroll: false as well */}
      <button 
        onClick={() => router.push(pathname, { scroll: false })}
        className="w-full mt-4 py-2 text-xs font-semibold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors border-t"
      >
        Reset All
      </button>
    </div>
  );
}