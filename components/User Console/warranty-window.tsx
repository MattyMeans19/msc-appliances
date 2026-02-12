'use client';

import { useState, useEffect } from 'react';
import { GetProduct } from '@/actions/business/inventory';

interface WarrantyDisplayProps {
    sku: string;
    signature: string; // This is the {Signature} prop
    close: () => void;
}

export default function WarrantyDisplay({ sku, signature, close }: WarrantyDisplayProps) {
    const [lang, setLang] = useState<'EN' | 'ES'>('EN');
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProductData() {
            try {
                const data = await GetProduct(sku);
                if (data && typeof data !== 'string') {
                    setProduct(data);
                }
            } catch (err) {
                console.error("Failed to fetch product for warranty:", err);
            } finally {
                setLoading(false);
            }
        }
        loadProductData();
    }, [sku]);

    const handlePrint = () => {
        const printContent = document.getElementById('warranty-legal-text');
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Warranty Receipt - SKU: ${sku}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { font-family: sans-serif; padding: 40px; line-height: 1.5; color: #111; }
                            h1 { border-bottom: 2px solid #dc2626; margin-top: 25px; margin-bottom: 10px; font-weight: bold; color: #dc2626; font-size: 1rem; text-transform: uppercase; }
                            h2 { text-align: center; font-weight: bold; font-size: 1.3rem; margin-bottom: 20px; text-decoration: underline; }
                            p, li { font-size: 0.95rem; margin-bottom: 0.8rem; }
                            .sig-box { margin-top: 50px; border: 2px dashed #ccc; padding: 20px; border-radius: 10px; }
                        </style>
                    </head>
                    <body>
                        ${printContent?.innerHTML}
                        <div class="sig-box">
                            <p style="font-size: 0.75rem; color: #666; text-transform: uppercase; font-weight: bold;">Digital Signature Verification</p>
                            <p style="font-family: 'Times New Roman', serif; font-style: italic; font-size: 1.75rem; margin: 10px 0;">
                                Signed by: ${signature}
                            </p>
                            <p style="font-size: 0.85rem;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p style="font-size: 0.85rem;"><strong>Product SKU:</strong> ${sku}</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 bg-white rounded-3xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-3 font-bold text-slate-500">Loading Policy Data...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-white max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Control Bar */}
            <div className="flex w-full border-b justify-end gap-6 p-4 bg-slate-50 sticky top-0 z-20 items-center">
                <button 
                    className="text-[10px] font-black px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
                    onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
                >
                    {lang === 'EN' ? 'ESPAÑOL' : 'ENGLISH'}
                </button>
                <button className="text-xl hover:scale-110 active:scale-95 transition-all" title="Print Policy" onClick={handlePrint}>🖨️</button>
                <button className="text-xl hover:scale-110 active:scale-95 transition-all" title="Close" onClick={close}>❌</button>
            </div>

            <div id="warranty-legal-text" className="px-10 py-8 overflow-y-auto">
                {lang === 'EN' ? (
                    <div className="text-slate-800">
                        <h2 className="text-center font-bold text-xl mb-8">MSC RETURN & WARRANTY POLICY</h2>
                        
                        <div className="bg-red-50 border-l-4 border-red-600 p-5 mb-8 rounded-r-xl">
                            <p className="font-bold text-red-900 text-base leading-tight">
                                {product?.parts_labor || 90}-Day Parts & Labor Warranty
                            </p>
                            <p className="text-sm text-red-700 mt-1 italic">
                                {product?.in_store || 14}-Day In-Shop warranty applies to sale items or residents outside 30-mile radius.
                            </p>
                        </div>

                        <section className="mb-6">
                            <h1 className="text-red-600 font-bold mb-2">Warranty Coverage:</h1>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li>Covers use in single-family homes only.</li>
                                <li>Refrigerators must be transported <strong>upright</strong>. Laying them down voids warranty.</li>
                                <li>Acts of God, power surges, and infestations are not covered.</li>
                                <li>Food loss is not covered.</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h1 className="text-red-600 font-bold mb-2">Returns & Refunds:</h1>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li>14-day return policy with original receipt.</li>
                                <li>Delivery and diagnostic fees are non-refundable.</li>
                                <li>Items must be returned in the same cosmetic condition as sold.</li>
                            </ul>
                        </section>
                    </div>
                ) : (
                    <div className="text-slate-800">
                        <h2 className="text-center font-bold text-xl mb-8">POLÍTICA DE DEVOLUCIÓN Y GARANTÍA</h2>
                        
                        <div className="bg-red-50 border-l-4 border-red-600 p-5 mb-8 rounded-r-xl">
                            <p className="font-bold text-red-900 text-base leading-tight">
                                {product?.parts_labor || 90} Días de Garantía en Piezas y Mano de Obra
                            </p>
                            <p className="text-sm text-red-700 mt-1 italic">
                                {product?.in_store || 14} Días de garantía en taller para artículos en oferta o fuera del radio.
                            </p>
                        </div>

                        <section className="mb-6">
                            <h1 className="text-red-600 font-bold mb-2">Cobertura de Garantía:</h1>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li>Solo para uso en hogares unifamiliares.</li>
                                <li>Refrigeradores deben transportarse verticalmente.</li>
                                <li>Rayos, sobrecargas eléctricas e infestaciones anulan la garantía.</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h1 className="text-red-600 font-bold mb-2">Devoluciones:</h1>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li>14 días para devoluciones con recibo original.</li>
                                <li>Cargos de entrega y diagnóstico no son reembolsables.</li>
                            </ul>
                        </section>
                    </div>
                )}

                {/* SIGNATURE AREA - Always Displayed */}
                <div className="mt-10 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 relative overflow-hidden">
                    <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-6 py-4 rotate-45">
                        VERIFIED
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Digital Signature Acknowledgment
                    </p>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1">Digitally Signed By:</span>
                        <p className="text-3xl font-serif italic text-slate-900 border-b border-slate-300 pb-2">
                           {signature}
                        </p>
                        <div className="flex justify-between mt-4 items-center">
                            <p className="text-[11px] text-slate-400 font-mono uppercase">
                                SKU REF: {sku}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono uppercase">
                                Stamp: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}