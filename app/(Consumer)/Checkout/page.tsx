'use client';

import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { ProcessPayment } from '@/actions/checkout';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const totalWithTax = (cartTotal * 1.08125).toFixed(2);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // 1. Format Card Data
    const rawMonth = formData.get('month')?.toString() || "";
    const rawYear = formData.get('year')?.toString() || "";
    const formattedMonth = rawMonth.padStart(2, '0');
    const formattedYear = rawYear.length === 2 ? `20${rawYear}` : rawYear;

    const secureData: any = {
      cardData: {
        cardNumber: formData.get('cardNumber')?.toString().replace(/\s+/g, ''),
        month: formattedMonth,
        year: formattedYear,
        cardCode: formData.get('cardCode'),
      },
      authData: {
        apiLoginID: process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID,
        clientKey: process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY,
      }
    };

    // 2. Dispatch to Authorize.net
    // @ts-ignore
    window.Accept.dispatchData(secureData, async (response: any) => {
      if (response.messages.resultCode === "Error") {
        console.error("Accept.js Error:", response.messages.message);
        alert(`Payment Error: ${response.messages.message[0].text}`);
        setLoading(false);
      } else {
        
        // 3. Prepare items for SQL insertion (including signatures)
        const finalizedItems = cart.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          signature: (item as any).signature || 'No Signature Provided'
        }));

        // 4. Send to our SQL-based Server Action
        const result: any = await ProcessPayment({
          opaqueDataValue: response.opaqueData.dataValue,
          opaqueDataDescriptor: response.opaqueData.dataDescriptor,
          amount: totalWithTax,
          customer: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            address: (formData.get('address') as string) || '5815 Lomas Blvd NE, Albuquerque, NM 87110', // Default to store if pickup
          },
          deliveryMethod,
          skuList: cart.map(i => i.sku).join(','),
          items: finalizedItems, 
        });

        if (result.success) {
          clearCart();
          const finalId = result.transId.startsWith('sale_') 
          ? result.transId 
          : `sale_${result.transId}`;
          
          window.location.href = `/Checkout/Success?transId=${finalId}`;
        } else {
          alert(result.error || "Transaction Failed");
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white border rounded-3xl shadow-xl my-10">
      <Script src="https://jstest.authorize.net/v1/Accept.js" />
      
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="mb-6 text-slate-500 font-semibold border-b pb-4 text-lg">
        Total: <span className="text-red-600">${totalWithTax}</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3">
          <input name="firstName" placeholder="First Name" className="p-3 border rounded-xl bg-slate-50" required />
          <input name="lastName" placeholder="Last Name" className="p-3 border rounded-xl bg-slate-50" required />
        </div>
        <input name="email" type="email" placeholder="Email Address" className="p-3 border rounded-xl bg-slate-50" required />
        <input name="phone" type="tel" placeholder="Phone Number" className="p-3 border rounded-xl bg-slate-50" required />

        {/* Fulfillment Choice */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-2">
          <p className="font-bold text-xs mb-3 uppercase tracking-widest text-slate-400">Fulfillment Method</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input 
                type="radio" 
                name="fulfillment" 
                checked={deliveryMethod === 'pickup'} 
                onChange={() => setDeliveryMethod('pickup')} 
                className="w-4 h-4 accent-red-600" 
              />
              <span className="text-slate-700 font-medium text-sm">In-Store Pickup (Free)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input 
                type="radio" 
                name="fulfillment" 
                checked={deliveryMethod === 'delivery'} 
                onChange={() => setDeliveryMethod('delivery')} 
                className="w-4 h-4 accent-red-600" 
              />
              <span className="text-slate-700 font-medium text-sm">Local Delivery (Within 30 miles)</span>
            </label>
          </div>
        </div>

        {/* Address Field */}
        {deliveryMethod === 'delivery' && (
          <input 
            name="address" 
            placeholder="Delivery Address (Street, City, Zip)" 
            className="p-3 border-2 border-red-100 rounded-xl bg-red-50/30 animate-in fade-in slide-in-from-top-2" 
            required 
          />
        )}

        <hr className="my-2 border-slate-100" />
        
        {/* Payment Info */}
        <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Card Details</p>
        <input name="cardNumber" placeholder="Card Number" className="p-3 border rounded-xl bg-slate-50" required />
        <div className="flex gap-2">
          <input name="month" placeholder="MM" className="w-1/3 p-3 border rounded-xl bg-slate-50" required />
          <input name="year" placeholder="YY" className="w-1/3 p-3 border rounded-xl bg-slate-50" required />
          <input name="cardCode" placeholder="CVV" className="w-1/3 p-3 border rounded-xl bg-slate-50" required />
        </div>

        {/* Privacy Policy */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl mt-4 border border-slate-100">
          <input 
            type="checkbox" 
            id="privacy"
            required 
            checked={privacyAccepted} 
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-red-600"
          />
          <label htmlFor="privacy" className="text-[10px] text-slate-500 leading-tight cursor-pointer">
            I agree to the <strong>Privacy Policy</strong>: Data is used only for order fulfillment. MSC Appliances does not sell data to 3rd parties.
          </label>
        </div>
        
        <button 
          type="submit"
          disabled={loading || !privacyAccepted}
          className="bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/20 mt-2"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
      </form>
    </div>
  );
}