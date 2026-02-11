'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import WarrantyInfo from '@/components/inventory/warranty-english';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, saveSignature } = useCart();
  
  // Track which item is currently being signed (for the modal)
  const [signingSku, setSigningSku] = useState<string | null>(null);
  // Track names locally just for the UI "Signed By" badges
  const [signedNames, setSignedNames] = useState<Record<string, string>>({});

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const TAX_RATE = 0.0763;
  const salesTax = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + salesTax;

  // This handles the data storage for the order AND the UI update
  const handleFinalSignature = (name: string, canvasData: string) => {
    if (signingSku) {
      // 1. Save to global Context (for the database later)
      saveSignature(name, canvasData);
      
      // 2. Update local UI to show the "✓ Signed" badge
      setSignedNames(prev => ({ ...prev, [signingSku]: name }));
      
      // 3. Close the modal
      setSigningSku(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-slate-700">Your cart is empty</h2>
        <Link href="/Products" className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors">
          Browse Inventory
        </Link>
      </div>
    );
  }

  const allSigned = cart.every(item => signedNames[item.sku]);

  return (
    <div className="max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ITEMS LIST */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.map((item) => (
          <div key={item.sku} className="flex flex-col p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-center">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <CldImage src={item.photo} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="grow">
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <p className="font-semibold text-red-600">{formatter.format(item.price / 100)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {signedNames[item.sku] ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200 uppercase tracking-tight">
                    ✓ Signed By: {signedNames[item.sku]}
                  </span>
                ) : (
                  <button 
                    onClick={() => setSigningSku(item.sku)}
                    className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    Sign Warranty
                  </button>
                )}
                <button onClick={() => removeFromCart(item.sku)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <small>Remove</small>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY SIDEBAR */}
      <div className="h-fit p-6 border rounded-3xl bg-slate-50 sticky top-24 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        
        <div className="space-y-3 border-b pb-4 mb-4">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({cart.length} items)</span>
            <span>{formatter.format(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Sales Tax (7.63%)</span>
            <span>{formatter.format(salesTax)}</span>
          </div>
        </div>
        
        <div className="flex justify-between font-bold text-2xl mb-6 items-baseline">
          <span>Total</span>
          <span className="text-red-600">{formatter.format(grandTotal)}</span>
        </div>

        {allSigned ? (
          <Link href="/Checkout" className="block w-full text-center bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-red-600 transition-all transform hover:-translate-y-1">
            Proceed to Checkout
          </Link>
        ) : (
          <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-4 rounded-2xl cursor-not-allowed">
            Please Sign All Warranties
          </button>
        )}
      </div>

      {/* WARRANTY MODAL */}
      {signingSku && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative">
             <WarrantyInfo 
                parts_labor={90} 
                in_store={14} 
                showSignature={true}
                // Updated prop name to handle the signature + data
                onSign={handleFinalSignature} 
                close={() => setSigningSku(null)} 
             />
          </div>
        </div>
      )}
    </div>
  );
}