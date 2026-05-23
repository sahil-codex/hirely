import{
    getProfileByUserId,
    createProfile,
    updateProfile,
} from "@/repositories/profile.repository";
import { P } from "node_modules/tailwindcss/dist/resolve-config-QUZ9b-Gn.mjs";

export async function getProfileService(user:{userId:string,role:string;}){
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidates can access profiles");
    }
    const profile = await getProfileByUserId(user.userId);
    return profile;
}

export async function saveProfileService(
    user:{userId:string,role:string;

    },
    data:{
      fullName?:string;
      headline?:string;
      bio?:string;
      location?:string;
      skills?:string[];
      experience?:number;
      company?:string;
      education?:string;
      resumeUrl?:string;
    }
) {
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidate can update profiles");
    }
    const existingPrifle = await getProfileByUserId(user.userId);
    if(existingPrifle){
        return await updateProfile(user.userId,data);
    }
    return await createProfile({
        userId:user.userId,
        ...data,
    });
}