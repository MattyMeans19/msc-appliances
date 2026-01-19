import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetEmployees } from "@/actions/business/actions";
import EmployeeTable from "@/components/admin-tools/employee-table";


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
            <div className="bg-slate-400 p-5 text-2xl w-full text-center rounded-2xl">
                <h2>Inventory Access - Admin, Manager, Employee</h2>
                <h2>Create new users- Admin, Manager</h2>
                <h2>Delete Users- Admin</h2>
                <h2>Create New Specials- Admin, Manager</h2>
                <h2>Change Specials- Admin, Manager</h2>
                <h2>Edit any user- Admin</h2>
                <h2>Any user can edit their own data.</h2>
            </div>
            <EmployeeTable 
                array={userList}
                curentUser={currentUser}
            />
        </div>
     </div>
    )
    
}