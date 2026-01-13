
interface Employee {
    username: string,
    fName: string,
    lName: string,
    privileges: string
}
export default function EmployeeTable(props: Employee){
    return(
        <tbody>
            <tr>
                <td className="Table-item">{props.username}</td>
                <td className="Table-item">{props.fName}</td>
                <td className="Table-item">{props.lName}</td>
                <td className="Table-item">{props.privileges}</td>
                <td className="Table-item"><button>📝</button></td>                           
            </tr>
        </tbody>
    )
}