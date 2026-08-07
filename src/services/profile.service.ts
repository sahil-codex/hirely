import{
    getProfileByUserId,
    createProfile,
    updateProfile,
} from "@/repositories/profile.repository";

import { ProfileUpdateInput } from "@/validators/profile.validator";


type AuthUser = {
    userId:string;
    role:string;
};
export async function getProfileService(user:AuthUser){
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidates can access profiles");
    }
    const profile = await getProfileByUserId(user.userId);
    return profile;
}

export async function saveProfileService(
    user:AuthUser,data:ProfileUpdateInput
){
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidates can update profiles");
    }
    const existingProfile = await getProfileByUserId(user.userId);

    if(existingProfile){
        return await updateProfile(user.userId,data);
    }
    return await createProfile({
        userId: user.userId,...data,
    });
}
