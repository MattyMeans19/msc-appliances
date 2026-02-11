'use client';
import { useState } from 'react';

interface Warranties {
    in_store: number;
    parts_labor: number;
    close: () => void;
    showSignature: boolean;
    onSign?: (signatureName: string, canvasData: string) => void;
}

export default function WarrantyInfo(props: Warranties) {
    const [lang, setLang] = useState<'EN' | 'ES'>('EN');
    const [sigName, setSigName] = useState('');

    const handleConfirmSignature = () => {
        if (sigName.trim().length < 2) return alert("Please enter a valid name to sign.");
        if (props.onSign) props.onSign(sigName, sigName);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('warranty-legal-text');
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>MSC Warranty & Service Policies</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { font-family: sans-serif; padding: 30px; line-height: 1.4; color: #111; }
                            h1 { border-bottom: 2px solid #dc2626; margin-top: 25px; margin-bottom: 10px; font-weight: bold; color: #dc2626; font-size: 1.1rem; text-transform: uppercase; }
                            h2 { text-align: center; font-weight: bold; font-size: 1.25rem; margin-bottom: 20px; text-decoration: underline; }
                            ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
                            li { margin-bottom: 0.4rem; font-size: 0.9rem; }
                            p { font-size: 0.9rem; margin-bottom: 1rem; }
                        </style>
                    </head>
                    <body>
                        ${printContent?.innerHTML}
                        <div style="margin-top: 30px; border-top: 1px solid #000; padding-top: 10px;">
                            <p><strong>Digitally Signed By:</strong> ${sigName || '________________'}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                        <script>
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white max-h-[90vh]">
            {/* Header */}
            <div className="flex flex-nowrap w-full border-b justify-end gap-10 p-4 no-print bg-white sticky top-0 z-10">
                <button 
                    className="text-sm font-bold px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200"
                    onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
                >
                    {lang === 'EN' ? 'Ver en Español' : 'View in English'}
                </button>
                <button className="text-2xl cursor-pointer" onClick={handlePrint}>🖨️</button>
                <button className="text-2xl cursor-pointer" onClick={() => props.close()}>❌</button>
            </div>

            <div id="warranty-legal-text" className="px-8 pb-10 overflow-y-auto text-gray-900">
                {lang === 'EN' ? (
                    <div className="leading-relaxed">
                        <h2 className="text-center font-bold text-xl mb-6">MSC RETURN & WARRANTY POLICY</h2>
                        <p>
                            <span className="font-bold">{props.parts_labor}</span> day parts & labor warranty ($1.75/mile trip charge applies out of ABQ/Rio Rancho area)<br/>
                            <span className="font-bold">{props.in_store}</span> day IN SHOP warranty applies on sale items, or if you reside outside our 30 mile radius service area **<br/>
                            Lightning/power surges, acts of God, infestations of any kind, issues with the home (and not the appliance) &/or physical damage are not covered, & void your warranty.<br/>
                            Service fees apply for warranty service calls where issues are not related to the unit. We will not install units when there are issues with the home/installation connections.<br/>
                            **Appliances are sold "AS IS" cosmetically & have a 14 day return policy.<br/>
                            **New parts are nonrefundable if opened, installed, or used.<br/>
                            **Delivery & Service Diagnostic fees are non-refundable, non-transferable, once diagnosis/trip is complete.<br/>
                            **$20 door removal, $20 cleaning fee on return/exchanges; damage/restocking fees may apply.<br/>
                            Receipts required for refunds, service, and exchange.
                        </p>

                        <h1 className="font-bold">Warranty:</h1>
                        <ul className="list-disc ml-5">
                            <li>Our 90-day warranty covers products (parts & labor) for use in single family homes only. Commercial use is subject to a 30 day warranty with prior management approval only.</li>
                            <li>WIFI Features are not covered under warranty by MSC Appliance.</li>
                            <li>Original warranty remains in effect for returns/exchanges and warranty exchanges.</li>
                            <li>Warranty on parts requires original model & serial number.</li>
                            <li>Refrigerators must be transported upright, and NEVER laid on their side or back. Doing so voids all warranty and return options.</li>
                            <li>We do not cover food loss.</li>
                            <li>MSC Appliance does not cover home issues such as plumbing, corroded/backed up lines, clogged dryer ducting, gas line issues, improper install, or old installation accessories.</li>
                        </ul>
                        <p className="italic">If we service a unit under warranty and find the issue to be with the home, a service fee of $89 applies. Unpaid service fees void remaining warranty.</p>

                        <h1 className="font-bold">Return/Delivery:</h1>
                        <ul className="list-disc ml-5">
                            <li>Unsatisfied products may be returned within 14 days with receipt.</li>
                            <li>Returns are subject to restocking fees if not returned complete and in same condition.</li>
                            <li>Items with major damage will not be returned or refunded.</li>
                            <li>Acima returns must pay applicable fees up front BEFORE lease termination.</li>
                            <li>Cash/Check refunds processed within 2 business days.</li>
                            <li>24 hour cancellation required for refund.</li>
                            <li>Reminder calls are a courtesy; we wait only 15 minutes at delivery address before moving on.</li>
                            <li>You are responsible for pickup/redelivery fees for exchanges/returns.</li>
                        </ul>

                        <h1 className="font-bold">Service Policies:</h1>
                        <ul className="list-disc ml-5">
                            <li>Service fees collected in advance; no scheduling until payment is received.</li>
                            <li>24 HOUR cancellation required for refund.</li>
                            <li>In-shop diagnostic fees are non-refundable if estimate is declined.</li>
                            <li>Products not picked up within 10 days of completion may be sold or scrapped.</li>
                            <li>In-home fee covers trip and initial diagnosis; it is not always applied toward parts/labor.</li>
                        </ul>
                    </div>
                ) : (
                    <div className="leading-relaxed">
                        <h2 className="text-center font-bold text-xl mb-6">POLÍTICA DE DEVOLUCIÓN Y GARANTÍA DE MSC</h2>
                        <p>
                            Garantía de piezas y mano de obra de <span className="font-bold">{props.parts_labor}</span> días (cargo de $1.75/milla fuera de ABQ/Rio Rancho)<br/>
                            La garantía en taller de <span className="font-bold">{props.in_store}</span> días se aplica a artículos en oferta o fuera del radio de 30 millas **<br/>
                            Rayos, casos de fuerza mayor, infestaciones, problemas con la vivienda y daños físicos no están cubiertos y anulan la garantía.<br/>
                            Se aplican tarifas de servicio si los problemas no están relacionados con la unidad. No instalaremos si hay problemas con las conexiones de la vivienda.<br/>
                            **Electrodomésticos se venden "TAL CUAL" estéticamente; política de devolución de 14 días.<br/>
                            **Piezas nuevas no son reembolsables si se abren o usan.<br/>
                            **Tarifas de entrega y diagnóstico no son reembolsables ni transferibles.<br/>
                            **Cargo de $20 por desmontaje de puerta, $20 por limpieza; pueden aplicar cargos por reabastecimiento.<br/>
                            Se requiere recibo para reembolsos, servicio y cambios.
                        </p>

                        <h1 className="font-bold">Garantía:</h1>
                        <ul className="list-disc ml-5">
                            <li>Nuestra garantía de 90 días cubre uso en viviendas unifamiliares solamente. Uso comercial sujeto a 30 días con aprobación previa.</li>
                            <li>Las funciones Wi-Fi no están cubiertas por la garantía.</li>
                            <li>La garantía original permanece vigente para devoluciones y cambios.</li>
                            <li>Garantía de piezas requiere modelo y número de serie originales.</li>
                            <li>Refrigeradores deben transportarse verticalmente. Acostarlos anula la garantía y devoluciones.</li>
                            <li>No cubrimos la pérdida de alimentos.</li>
                            <li>MSC no cubre problemas de plomería, tuberías corroídas/atascadas, conductos de secadora obstruidos o problemas de gas.</li>
                        </ul>
                        <p className="italic">Si el problema es de la vivienda, se aplicará una tarifa de $89. El impago anula la garantía restante.</p>

                        <h1 className="font-bold">Devoluciones/Entregas:</h1>
                        <ul className="list-disc ml-5">
                            <li>Puede devolver productos dentro de 14 días con recibo obligatorio.</li>
                            <li>Sujeto a cargos de reabastecimiento si no se devuelve completo y en la misma condición.</li>
                            <li>No se aceptan artículos con daños importantes.</li>
                            <li>Pagos a Acima requieren pagar tarifas antes de finalizar el contrato.</li>
                            <li>Reembolsos de efectivo/cheque en un plazo de 2 días hábiles.</li>
                            <li>Cancelación de 24 horas requerida para reembolso.</li>
                            <li>Solo esperaremos 15 minutos en la dirección de entrega antes de continuar.</li>
                            <li>Usted es responsable de la tarifa de recogida/reentrega para cambios.</li>
                        </ul>

                        <h1 className="font-bold">Políticas de Servicio:</h1>
                        <ul className="list-disc ml-5">
                            <li>Tarifas de servicio se cobran por adelantado; no hay citas sin pago.</li>
                            <li>Cancelación de 24 HORAS requerida para reembolso.</li>
                            <li>Tarifas de diagnóstico en taller no son reembolsables si rechaza el presupuesto.</li>
                            <li>Productos no recogidos en 10 días pueden ser vendidos o desechados.</li>
                            <li>La tarifa de servicio a domicilio cubre viaje y diagnóstico inicial.</li>
                        </ul>
                    </div>
                )}

                {props.showSignature && (
                    <div className="mt-12 pt-6 border-t border-black bg-slate-50 p-6 rounded-2xl shadow-inner">
                        <p className="font-bold text-[11px] uppercase mb-6 text-red-600">
                            {lang === 'EN' 
                                ? "BY TYPING YOUR NAME BELOW, I CONFIRM I HAVE READ AND AGREED TO ALL RETURN, WARRANTY, AND SERVICE POLICIES HEREIN." 
                                : "AL ESCRIBIR MI NOMBRE A CONTINUACIÓN, CONFIRMO QUE HE LEÍDO Y ACEPTO TODAS LAS POLÍTICAS DE DEVOLUCIÓN, GARANTÍA Y SERVICIO AQUÍ DESCRITAS."}
                        </p>
                        <div className="flex flex-col md:flex-row items-end gap-6">
                            <div className="grow w-full">
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Electronic Signature</label>
                                <input 
                                    type="text"
                                    value={sigName}
                                    onChange={(e) => setSigName(e.target.value)}
                                    placeholder={lang === 'EN' ? "Type Full Name..." : "Nombre Completo..."}
                                    className="w-full bg-transparent border-b-2 border-black h-12 text-2xl px-2 focus:outline-none focus:border-red-500 font-serif italic"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <button 
                onClick={handleConfirmSignature}
                className={`w-full md:w-auto bg-red-600 text-white px-8 py-4 rounded-xl font-bold
                    hover:bg-red-700 transition-all shadow-md active:scale-95 ${props.showSignature ? 'visible' : 'hidden'}`}
            >
                {lang === 'EN' ? "ACCEPT & SIGN" : "ACEPTAR Y FIRMAR"}
            </button>
        </div>
    );
}