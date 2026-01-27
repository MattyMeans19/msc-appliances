'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const transId = searchParams.get('transId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transId) {
      fetch(`/api/orders/${transId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [transId]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Verifying Transaction...</div>;
  if (!order || order.error) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 my-10 bg-white border border-slate-200 rounded-3xl shadow-sm" id="receipt-content">
      
      {/* HEADER FOR PRINTING */}
      <div className="hidden print:block mb-8 border-b-2 pb-4">
        <h1 className="text-2xl font-bold italic text-red-600">MSC APPLIANCES</h1>
        <p className="text-sm">5815 Lomas Blvd NE, Albuquerque, NM 87110</p>
      </div>

      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Payment Verified</span>
          <h2 className="text-3xl font-black mt-2">Thank You!</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">ID: {order.transactionId}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-slate-500">{order.phoneNumber}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full mb-8">
        <thead className="border-b border-slate-100">
          <tr className="text-left text-xs text-slate-400 uppercase tracking-widest">
            <th className="py-3">Appliance</th>
            <th className="py-3 text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {order.items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-4">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</p>
              </td>
              <td className="py-4 text-right font-semibold text-slate-700">
                ${(item.price / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER TOTALS */}
      <div className="w-full sm:w-64 ml-auto space-y-3 pt-4">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Fulfillment:</span>
          <span className="font-bold text-slate-900 uppercase text-xs">{order.fulfillmentType}</span>
        </div>
        <div className='flex flex-nowrap w-full text-slate-400 justify-between'>
          <p>Tax: </p>
          <p>${(order.totalAmount * 0.0819).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-2xl font-black border-t-4 border-slate-900 pt-4">
          <span>PAID</span>
          <span className="text-red-600">${parseFloat(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* DYNAMIC INSTRUCTIONS */}
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 no-print">
        <h3 className="font-bold text-slate-800 mb-2">Next Steps</h3>
        {order.fulfillmentType === 'delivery' ? (
          <p className="text-sm text-slate-600 leading-relaxed">
            Since you requested <strong>Local Delivery</strong>, our logistics team will review your address and call you at <strong>{order.phoneNumber}</strong> within 24 business hours to coordinate the drop-off.
          </p>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed">
            Your order is ready for <strong>In-Store Pickup</strong>. Please visit our Lomas Blvd location with a copy of this receipt (printed or digital) and a valid photo ID.
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-8 no-print">
        <button 
            onClick={() => window.print()}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
        >
            Print Receipt
        </button>
        <button 
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
        >
            Back to Home
        </button>
      </div>

      <style jsx global>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          #receipt-content { border: none !important; box-shadow: none !important; width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}