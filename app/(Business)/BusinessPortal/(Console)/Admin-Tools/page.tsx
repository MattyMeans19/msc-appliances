import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetEmployees } from "@/actions/business/actions";
import EmployeeTable from "@/components/employee-table";


export default async function AdminTools(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;

    const userList = await GetEmployees(currentUser) as Array<any>;

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    return(
     <div className="grow flex flex-col">
        <PortalHeader 
            general="bg-gray-200"
            inventory="bg-gray-200"
            tools="bg-gray-400"
        />
        <div className="m-10 grow border flex flex-col p-5 gap-10">
            <h2 className="text-center">Admin Tools details will go here</h2>
            <div className="border-t grow">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="Table-header">Username</th>
                            <th className="Table-header">First Name</th>
                            <th className="Table-header">Last Name</th>
                            <th className="Table-header">Privileges</th>
                            <th className="Table-header">Edit</th>
                        </tr>
                    </thead>
                    {userList.map((employee) =>(
                        <EmployeeTable
                            key={employee.id}
                            username={employee.username}
                            fName={employee.fname}
                            lName={employee.lname}
                            privileges={employee.privilege}
                        />
                    ))}
                </table>
            </div>
        </div>
     </div>
    )
    
}