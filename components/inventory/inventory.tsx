
export default function InventoryDisplay(){
    return(
        <div className="grow max-h-screen w-[80vw] self-center border mx-10 mb-5 flex flex-col gap-10 p-10">
            <div className="grid grid-cols-3 justify-around border-5 border-slate-500/15 rounded-2xl shadow-2xl shadow-slate-500/25 p-5">
                <label htmlFor="search" className="md:text-3xl w-full">Search by Name or SKU: </label>
                <input type="text" id="search" placeholder="Search" className="col-span-2 border-2 border-slate-400 rounded-2xl w-full place-self-center p-2"></input>
            </div>
            <button className="border-5 border-double border-slate-400 rounded-full w-50 place-self-center bg-red-500 text-3xl">Add Item</button>
            <div className="grow border">

            </div>
        </div>
    )
}