import { GetAllSpecials, GetSpecial } from "@/actions/business/actions"
import SpecialsEditor from "./specials-editor"

export default async function SpecialsSelector(){
    const specials = await GetAllSpecials();
    const current = await GetSpecial();
    return(
        <SpecialsEditor
            specials = {specials!.specialsResult}
            current={current}
        />
    )
}