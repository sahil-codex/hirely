import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserFromRequest(req:Request){
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if(!token) return null;
    const {payload} = await jwtVerify(token,secret);
    return payload as {userId:string;role:string};
}