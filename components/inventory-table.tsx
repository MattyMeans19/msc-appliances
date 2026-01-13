
export default function InventoryTable(){
    return(
        <table className="w-full">
            <caption className="text-4xl">Inventory</caption>
            <thead className="border-t">
                <tr>
                    <th className="Table-header">Item Sku</th>
                    <th className="Table-header">Item Name</th>
                    <th className="Table-header">Item Description</th>
                    <th className="Table-header">Item Price</th>
                    <th className="Table-header">Item Stock</th>
                    <th className="Table-header">Item Type</th>
                    <th className="Table-header">Item Sub-type</th>
                    <th className="Table-header">Item Images</th>
                    <th className="Table-header">Is Deliverable</th>
                    <th className="Table-header">FB Link</th>
                    <th className="Table-header"><button>Edit</button></th>
                </tr>  
            </thead>
            <tbody>
                <tr>
                    <td className="Table-item">Item Sku</td>
                    <td className="Table-item">Item Name</td>
                    <td className="Table-item">Item Description</td>
                    <td className="Table-item">Item Price</td>
                    <td className="Table-item">Item Stock</td>
                    <td className="Table-item">Item Type</td>
                    <td className="Table-item">Item Sub-type</td>
                    <td className="Table-item">Item Images</td>
                    <td className="Table-item">Is Deliverable</td>
                    <td className="Table-item">FB Link</td>
                    <td className="Table-item"><button>📝</button></td>
                </tr> 
            </tbody>
            
        </table>
    )
}