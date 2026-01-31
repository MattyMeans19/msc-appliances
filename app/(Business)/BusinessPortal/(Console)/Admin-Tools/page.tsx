import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetAccess, GetEmployees } from "@/actions/business/actions";
import EmployeeTable from "@/components/admin-tools/employee-table";
import Coupons from "@/components/admin-tools/coupons";
import { GetCoupons } from "@/actions/business/coupons";
import { GetAllSpecials } from "@/actions/business/specials"
import SpecialsEditor from "@/components/specials/specials-editor"



export default async function AdminTools(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;

    const userList = await GetEmployees(currentUser) as Array<any>;

    const access = await GetAccess(currentUser) as string;

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    const coupons = await GetCoupons();
    const specials = await GetAllSpecials();
    

    return(
     <div className="grow flex flex-col h-full">
        <PortalHeader 
            general="bg-gray-200"
            inventory="bg-gray-200"
            tools="bg-gray-400"
        />
        <div className="md:m-10 grow flex flex-col lg:grid grid-cols-5 p-2 gap-10">
            <div className="bg-slate-400 p-5 text-2xl w-full text-center rounded-2xl col-span-3 row-span-3 h-full flex flex-col relative md:static">
                <h1 className="font-bold underline">User Details</h1>
                <h2>Inventory Access - Admin, Manager, Employee</h2>
                <h2>Create new users- Admin, Manager</h2>
                <h2>Delete Users- Admin</h2>
                <h2>Create New Specials- Admin, Manager</h2>
                <h2>Change Specials- Admin, Manager</h2>
                <h2>Edit any user- Admin</h2>
                <h2>Create Coupons- Admin, Manager</h2>
                <h2>Any user can edit their own data.</h2>
                <div className="grow border-5 border-double bg-white">
                    <EmployeeTable 
                        array={userList}
                        curentUser={currentUser.toUpperCase()}
                    />                
                </div>
            </div>
            <Coupons 
                coupons={coupons}
                user={access}
            />
            <SpecialsEditor
                specials = {specials!}
                user={access}
            />
        </div>
     </div>
    )
    
}