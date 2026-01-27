'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import WarrantyInfo from '@/components/inventory/warranty-english'; // Adjust path as needed

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  
  // Track which item is currently being signed
  const [signingSku, setSigningSku] = useState<string | null>(null);
  // Track which items have been signed
  const [signedItems, setSignedItems] = useState<Record<string, string>>({});

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSignComplete = (name: string) => {
    if (signingSku) {
      setSignedItems(prev => ({ ...prev, [signingSku]: name }));
      setSigningSku(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-slate-700">Your cart is empty</h2>
        <Link href="/Products" className="bg-red-500 text-white px-6 py-2 rounded-xl">
          Browse Inventory
        </Link>
      </div>
    );
  }

  // Check if all items in cart are signed
  const allSigned = cart.every(item => signedItems[item.sku]);

  return (
    <div className="max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.map((item) => (
          <div key={item.sku} className="flex flex-col p-4 border rounded-2xl bg-white shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="relative h-20 w-20 shrink-0">
                <CldImage src={item.photo} alt={item.name} fill className="object-cover rounded-lg" />
              </div>
              
              <div className="grow">
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <p className="font-semibold text-red-600">${formatter.format(item.price / 100)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {signedItems[item.sku] ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    ✓ SIGNED BY: {signedItems[item.sku]}
                  </span>
                ) : (
                  <button 
                    onClick={() => setSigningSku(item.sku)}
                    className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Sign Warranty
                  </button>
                )}
                <button onClick={() => removeFromCart(item.sku)} className="text-slate-400 hover:text-red-500">
                   <small>Remove</small>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY SIDEBAR */}
      <div className="h-fit p-6 border rounded-2xl bg-slate-50 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 border-b pb-4 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${formatter.format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Sales Tax (7.63%)</span>
                  {/* We use the same precise calculation as your original */}
                  <span>${(cartTotal * 0.0763).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span className="text-red-600">
                  ${(cartTotal * 1.0763).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

        {allSigned ? (
          <Link href="/Checkout" className="block w-full text-center bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg">
            Proceed to Checkout
          </Link>
        ) : (
          <button disabled className="w-full bg-slate-300 text-slate-500 font-bold py-4 rounded-xl cursor-not-allowed">
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
                onSign={handleSignComplete}
                close={() => setSigningSku(null)} 
             />
          </div>
        </div>
      )}
    </div>
  );
}