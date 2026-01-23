
interface Warranties{
    in_store: number, 
    parts_labor: number,
}

export default function WarrantyInfo(props: Warranties){
    return(
        <div className="h-full p-10">
            <div className="flex flex-nowrap w-full border-b place-content-end gap-20 mb-5">
                <button className="text-2xl cursor-pointer">🖨️</button>
                <button className="text-2xl cursor-pointer">❌</button>
            </div>
            <p>
                <span className="font-bold">{props.parts_labor}</span> day parts & labor warranty ($1.75/mile trip charge applies out of ABQ/Rio Rancho area)<br/>
                <span className="font-bold">{props.in_store}</span> day IN SHOP warranty applies on sale items, or if you reside outside our 30 mile radius service area **<br/>
                Lightning/power surges, acts of God, infestations of any kind, issues with the home 
                (and not the appliance *see below for more information) &/or physical damage are not covered, & void your warranty.<br/>
                Service fees apply for warranty service calls where issues are not related to the unit. 
                We will not install units when there are issues with the home/installation connections.<br/>
                **Appliances are sold "AS IS" cosmetically & have a 14 day return policy.<br/>
                "**New parts are nonrefundable if opened, installed, or used.<br/>
                **Delivery & Service Diagnostic fees are non-refundable, non-transferable, once diagnosis/trip is complete.<br/>
                **$20 door removal, $20 cleaning fee on return/exchanges; damage/restocking fees may apply<br/>
                Receipts required for refunds, service, and exchange
            </p>
            <h1 className="underline text-2xl text-red-500">WARRANTY</h1>
            <ul className="list-disc">
                <li>Our 90-day warranty covers products (parts & labor) for use in single family homes only. Any other use besides a single-family home is 
                    considered commercial use and subject to a 30 day warranty with prior management approval only. Should we find a unit being used in a 
                    fashion other than a single-family dwelling, warranty will only be covered within the 30 days from date of purchase. Service fees will 
                    apply for services completed.
                </li>
                <li>WIFI Features are not covered under warranty by MSC Appliance</li>
                <li>Original warranty (from original date of purchase) remains in effect for returns/exchanges and warranty exchanges.</li>
                <li>Warranty on parts requires the original model & serial number of the appliance they are being installed on, and are only honored if 
                    part ordered is compatible with the appliance.
                </li>
                <li>Refrigerators are to be transported upright, and NEVER laid on their side, or back. Should you lay a fridge down, you forfeit all 
                    warranty coverage and void your return options.
                </li>
                <li>We do not cover food loss</li>
                <li>MSC Appliance does not cover any issues under warranty with the home, such as:
                    <ul className="list-inside list-disc marker:text-slate-400">
                        <li>Issues with plumbing</li>
                        <li>Corroded lines, and/or backed up plumbing lines</li>
                        <li>Clogged internal home dryer ducting</li>
                        <li>Gas and/or gas line issues</li>
                        <li>Improper install or propane conversions not completed by MSC</li>
                        <li>Issues resulting from old installation accessories (i.e.: hoses, venting, gas lines, etc.)</li>
                        <li>Not to code ducting/gas/electrical/plumbing connections, or any licensures outside of appliance installation</li> 
                    </ul>
                </li>
            </ul>
            <p>In the scenario that we service a unit under warranty and find the issue to be with the home, and not the appliance, a service fee of 
                $89 would apply. (Discounted from normal in-home rates of $129) *Unpaid service fees void any remaining warranty on unit.
                <br/>
                **If you’ve purchased a unit from us and are needing service outside of the original warranty, please ask us for our discounted service rates 
                (only available with verification of initial purchase).
            </p>

            <h1 className="underline text-2xl text-red-500">RETURN/DELIVERY:</h1>
            <p>If for any reason you are unsatisfied with your product you may return it to us within 14 days of the original purchase date for a refund, 
                receipt REQUIRED.
            </p>
            <ul className="list-disc">
                <li>Returns are subject to restocking fees if they are not returned complete, and in the same condition you purchased. Items with major 
                    damage will not be returned or refunded.
                </li>
                <li>· Any returns purchased through Acima will be required to pay any applicable fees including delivery/pickup/cleaning fees up front 
                    BEFORE lease is terminated. All fees paid to Acima will be refunded by Acima.
                </li>
                <li>Returns originally paid in cash or check will be refunded within 2 business days.</li>
                <li>Any fees paid for propane conversions, including the kit costs/labor are non-refundable.</li>
                <li>· Delivery times are given at time of purchase. Should you miss your delivery time frame or need MSC Appliance to pick up your item in 
                    the event of a return, you are responsible for another pickup/delivery fee.
                </li>
                <li>24 hour cancellation is required for refund.</li>
                <li>· *Reminder calls are ONLY placed as a courtesy. Our deliveries are set up consecutively, so we are unable to wait to hear from you in 
                    the event we cannot reach you for the reminder call. We will only wait at the delivery address for 15 minutes before we move on to the 
                    next delivery, at which point, another delivery fee would apply to have the items, re-delivered in these scenarios.
                    <br/>
                    <p>If you’ve selected a product that will not suit your needs for any reason, including, but not limited to:</p>
                    <ul className="list-inside list-disc marker:text-slate-400">
                        <li>Dimension issues</li>
                        <li>Installations issues due to home readiness or installation location</li>
                        <li>Cosmetics, (all items are as is cosmetically)</li>
                        <li>General buyer’s remorse</li>
                    </ul>
                </li>
                <li>You are responsible for the pickup/redelivery fee for exchange/returns</li>
            </ul>
            <h1 className="underline text-2xl text-red-500">SERVICE POLICIES:</h1>
            <ul className="list-disc">
                <li>Service fees are collected in advance for scheduling, and/or in shop check in. We will not schedule until payment is received.</li>
                <li>24 HOUR cancelation is required for refund.</li>
                <li>Diagnostic fees in shop are applied towards parts & labor, and are non-transferable or refundable if you decide not to move forward with 
                    the estimate.
                </li>
                <li>Products not picked up within 10 days from, the repair/conversion completion date are subject to being sold @ cost of repairs or scrapped.</li>
                <li>· Service fee collected for in-home service, covers the trip and the initial diagnosis. It is not always applied towards parts and labor. 
                    The technician will provide a diagnosis and estimate on site. Should there be any amount of the service fee that can be applied towards parts 
                    and labor the technician will determine after the initial diagnosis.
                </li>
            </ul>
            <p className="font-bold">BY SIGNING BELOW, I CONFIRM I HAVE READ AND AGREED TO ALL RETURN, WARRANTY, AND POLICIES HEREIN.</p>
            <div className="flex flex-nowrap my-10">
                <p className="basis-1/5 text-2xl w-full text-center">Signature:</p>
                <span className="basis-4/5 border-b"></span>
            </div>
            <span className="mt-5 text-white">.</span>
        </div>
    )
}