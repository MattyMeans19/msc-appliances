
export default function MobileTable(){
    return(
        <table className="w-full">
            <caption className="text-center">Inventory</caption>
            <thead className="border-t">
                <tr>
                    <th className="Table-header">Item Sku</th>
                    <th className="Table-header">Item Name</th>
                    <th className="Table-header"><button>Edit</button></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="Table-item">Item Sku</td>
                    <td className="Table-item">Item Name</td>
                    <td className="Table-item"><button>📝</button></td>
                </tr>
            </tbody>
        </table>
    )
}