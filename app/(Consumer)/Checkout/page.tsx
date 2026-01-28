'use client';

import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { FinalCheck, ProcessPayment, CheckCoupon } from '@/actions/checkout';
import ProcessingOverlay from '@/components/processesing-overlay';

export type Coupon = {
  code: string,
  discount: number,
  type: string
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [deliveryAddress, updateAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Confirming Order...");

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [verifyingAddress, setVerifyingAddress] = useState(false);

  const discountAmount = coupon 
    ? (coupon.type === 'percent' ? cartTotal * (coupon.discount / 100) : coupon.discount)
    : 0;

  const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
  const taxAmount = subtotalAfterDiscount * 0.0763;
  const grandTotal = (subtotalAfterDiscount + taxAmount + deliveryFee).toFixed(2);

  useEffect(() => {
    if (deliveryMethod === 'pickup') {
      setDeliveryFee(0);
      updateAddress("");
    }
  }, [deliveryMethod]);

  // FIXED: Standardized handleApplyCoupon logic
  const handleApplyCoupon = async () => {
    if (!couponInput || !emailInput) {
      alert("Please enter your email and a coupon code.");
      return;
    }
    
    setProcessMessage("Verifying Coupon...");
    const res: any = await CheckCoupon(couponInput, emailInput);
    
    if (res.coupon) {
      // Handle array or single object response
      const couponData = Array.isArray(res.coupon) ? res.coupon[0] : res.coupon;
      setCoupon(couponData);
      alert(res.message || "Coupon Applied!");
    } else {
      setCoupon(null);
      alert(res.message || res.error || "Invalid Coupon");
    }
    setProcessMessage("Confirming Order...");
  };

const handleVerifyMileage = async () => {
    if (!deliveryAddress) return;
    setVerifyingAddress(true);
    try {
      const res = await fetch(`/api/check-mileage?address=${encodeURIComponent(deliveryAddress)}`);
      const data = await res.json();
      
      if (data.withinRange) {
        setDeliveryFee(data.fee);
        // Optional: show the distance in the UI
        console.log(`Distance: ${data.distance} miles`);
      } else {
        alert(data.message || "Address is outside our delivery range.");
        setDeliveryFee(0);
      }
    } catch (err) {
      alert("Error verifying address.");
    } finally {
      setVerifyingAddress(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyAccepted) return;

    setIsProcessing(true);
    
    setProcessMessage("Checking Availability...");
    const skusToCheck = cart.map(item => item.sku);
    const check = await FinalCheck(skusToCheck);

    if (!check.available) {
      alert(`Sorry, the following items were just sold: ${check.missing?.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    if (coupon) {
      const couponCheck: any = await CheckCoupon(coupon.code, emailInput);
      if (!couponCheck.coupon) {
        alert("Coupon is no longer valid or has already been used by this account.");
        setCoupon(null);
        setIsProcessing(false);
        return;
      }
    }

    setProcessMessage("Validating Card...");
    const formData = new FormData(event.currentTarget);
    const rawMonth = formData.get('month')?.toString() || "";
    const rawYear = formData.get('year')?.toString() || "";
    const formattedMonth = rawMonth.padStart(2, '0');
    const formattedYear = rawYear.length === 2 ? `20${rawYear}` : rawYear;

    const secureData: any = {
      cardData: {
        cardNumber: formData.get('cardNumber')?.toString().replace(/\s+/g, ''),
        month: formattedMonth,
        year: formattedYear,
        cardCode: formData.get('cardCode')?.toString(),
      },
      authData: {
        apiLoginID: process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID,
        clientKey: process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY,
      }
    };

    // @ts-ignore
    window.Accept.dispatchData(secureData, async (response: any) => {
      if (response.messages.resultCode === "Error") {
        alert(`Payment Error: ${response.messages.message[0].text}`);
        setIsProcessing(false);
      } else {
        setProcessMessage("Processing Payment...");

        const finalizedItems = cart.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          signature: (item as any).signature || 'No Signature Provided'
        }));

        const result: any = await ProcessPayment({
          opaqueDataValue: response.opaqueData.dataValue,
          opaqueDataDescriptor: response.opaqueData.dataDescriptor,
          amount: grandTotal,
          customer: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: emailInput,
            phone: formData.get('phone') as string,
            address: deliveryAddress || '5815 Lomas Blvd NE, Albuquerque, NM 87110',
          },
          deliveryMethod,
          deliveryFee,
          couponCode: coupon?.code || null,
          skuList: cart.map(i => i.sku).join(','),
          items: finalizedItems,
        });

        if (result.success) {
          setProcessMessage("Order Confirmed! Redirecting...");
          clearCart();
          window.location.href = `/Checkout/Success?transId=${result.transId.startsWith('sale_') ? result.transId : `sale_${result.transId}`}`;
        } else {
          alert(result.error || "Transaction Failed");
          setIsProcessing(false);
        }
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white border rounded-3xl shadow-xl my-10">
      {isProcessing && <ProcessingOverlay status={processMessage} />}
      <Script src="https://jstest.authorize.net/v1/Accept.js" />

      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      
      {/* LIVE ORDER SUMMARY */}
      <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Subtotal:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-sm text-green-600 font-bold">
            <span>Discount ({coupon.code}):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-slate-500">
          <span>Tax:</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        {deliveryMethod === 'delivery' && (
          <div className="flex justify-between text-sm text-slate-500">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t font-bold text-xl">
          <span>Total:</span>
          <span className="text-red-600">${grandTotal}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3">
          <input name="firstName" placeholder="First Name" className="p-3 border rounded-xl bg-slate-50" required />
          <input name="lastName" placeholder="Last Name" className="p-3 border rounded-xl bg-slate-50" required />
        </div>
        <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            className="p-3 border rounded-xl bg-slate-50" 
            required 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
        />
        <input name="phone" type="tel" placeholder="Phone Number" className="p-3 border rounded-xl bg-slate-50" required />

        {/* Fulfillment Choice */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-2">
          <p className="font-bold text-xs mb-3 uppercase tracking-widest text-slate-400">Fulfillment Method</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input type="radio" name="fulfillment" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="w-4 h-4 accent-red-600" />
              <span className="text-slate-700 font-medium text-sm">In-Store Pickup (Free)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input type="radio" name="fulfillment" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="w-4 h-4 accent-red-600" />
              <span className="text-slate-700 font-medium text-sm">Local Delivery (Within 30 miles)</span>
            </label>
          </div>
        </div>

        {/* Address & Mileage Check */}
        {deliveryMethod === 'delivery' && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-2">
              <input 
                name="address" 
                placeholder="Delivery Address" 
                className="flex-1 p-3 border-2 border-red-100 rounded-xl bg-red-50/30" 
                required
                onChange={(e) => updateAddress(e.target.value)}
              />
              <button 
                type="button"
                onClick={handleVerifyMileage}
                disabled={verifyingAddress || !deliveryAddress}
                className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold disabled:bg-slate-300"
              >
                {verifyingAddress ? "..." : "Verify"}
              </button>
            </div>
            {deliveryFee > 0 && <p className="text-[10px] text-green-600 font-bold ml-1">✓ Delivery Available (${deliveryFee.toFixed(2)})</p>}
          </div>
        )}

        {/* Coupon Code Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="font-bold text-xs mb-3 uppercase tracking-widest text-slate-400">Coupon Code</p>
          <div className="flex gap-2">
            <input 
              placeholder="Code" 
              className="flex-1 p-2 border rounded-lg uppercase" 
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            />
            <button 
              type="button" 
              onClick={handleApplyCoupon}
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Apply
            </button>
          </div>
          {coupon && (
              <p className="text-[10px] text-green-600 font-bold mt-2 ml-1">
                Coupon "{coupon.code}" Active
              </p>
          )}
        </div>

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
          <input type="checkbox" id="privacy" required checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-red-600" />
          <label htmlFor="privacy" className="text-[10px] text-slate-500 leading-tight cursor-pointer">
            I agree to the <strong>Privacy Policy</strong>: Data is used only for order fulfillment. MSC Appliances does not sell data to 3rd parties.
          </label>
        </div>
        
        <button 
          type="submit"
          disabled={isProcessing || !privacyAccepted || (deliveryMethod === 'delivery' && deliveryFee === 0)}
          className="bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/20 mt-2"
        >
          {isProcessing ? "Processing..." : `Pay $${grandTotal}`}
        </button>
      </form>
    </div>
  );
}