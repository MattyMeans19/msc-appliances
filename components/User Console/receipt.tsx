'use client'

import { Receipt } from "@/lib/definitions";

interface Info {
    order: Receipt
}

export default function ReceiptPopUp(data : Info) {
    const order = data.order

  return (
    <div 
      className="fixed inset-0 max-w-2xl max-h-fit self-center mx-auto p-8 my-10 bg-white border border-slate-200 rounded-3xl shadow-sm z-50 overflow-y-auto" 
      id="receipt-content"
    >
      
      {/* HEADER FOR PRINTING ONLY */}
      <div className="hidden print:block mb-8 border-b-2 pb-4">
        <h1 className="text-2xl font-bold italic text-red-600">MSC APPLIANCES</h1>
        <p className="text-sm">5815 Lomas Blvd NE, Albuquerque, NM 87110</p>
        <p className="text-xs text-slate-500">Receipt Generated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-black mt-2">Thank You!</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Order ID: {order.id?.replace('sale_', '')}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">{order?.firstName} {order?.lastName}</p>
            <p className="text-sm text-slate-500">{order?.phoneNumber}</p>
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
          {order?.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-4">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-mono uppercase">SKU: {item.sku.replace(('.0'),(''))}</p>
              </td>
              <td className="py-4 text-right font-semibold text-slate-700">
                ${(item.price / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER TOTALS */}
      <div className="w-full sm:w-64 ml-auto space-y-3 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Fulfillment:</span>
          <span className="font-bold text-slate-900 uppercase">{order?.fulfillmentType}</span>
        </div>
        
        {/* Uses the saved Delivery Fee */}
        {Number(order?.delivery_fee) > 0 && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Delivery Fee:</span>
            <span>${Number(order?.delivery_fee).toFixed(2)}</span>
          </div>
        )}

        {/* Uses the saved Tax Amount from your DB update */}
        <div className='flex justify-between text-xs text-slate-500'>
          <span>Tax:</span>
          <span>${Number(order?.tax_amount || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-2xl font-black border-t-4 border-slate-900 pt-4">
          <span>PAID</span>
          <span className="text-red-600">${Number(order?.totalAmount).toFixed(2)}</span>
        </div>
      </div>

{/* BUTTONS */}
      <div className="flex gap-3 mt-8 no-print">
        <button 
            onClick={() => window.print()}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
        >
            Print Receipt
        </button>
      </div>

        <style jsx global>{`
            @media print {
                /* 1. Hide the entire UI */
                body * {
                visibility: hidden;
                }

                /* 2. Show only the receipt and its children */
                #receipt-content, #receipt-content * {
                visibility: visible;
                }

                /* 3. The Force Move: Ignore parents and jump to top-left */
                #receipt-content {
                position: absolute !important;
                top: -500 !important;
                left: 0 !important;
                margin: 0 !important;
                padding: 1cm !important;
                width: 100% !important;
                max-width: none !important;
                border: none !important;
                box-shadow: none !important;
                
                /* This cancels out any "offset" from the parent containers */
                transform: translate(0, 0) !important;
                }

                /* 4. Kill the second page by removing body height */
                html, body {
                height: fit !important;
                overflow: hidden !important;
                background: white !important;
                }

                /* 5. Remove browser headers/footers */
                @page {
                size: auto;
                margin: 0mm;
                }

                /* 6. Ensure no parent container clips the print or adds height */
                div {
                overflow: visible !important;
                height: auto !important;
                }

                .no-print, button {
                display: none !important;
                }
            }
            `}</style>
    </div>
  );
}