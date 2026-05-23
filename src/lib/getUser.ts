import { jwtVerify } from "jose";
import {cookies} from "next/headers";
import { NextRequest } from "next/server";
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserFromRequest(req:NextRequest){
    try{
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token) return null;
    const {payload} = await jwtVerify(token,secret);
    return payload as {userId:string;role:string};
}catch{
    return null;
}
}