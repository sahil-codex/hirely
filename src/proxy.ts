import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {jwtVerify} from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
async function verifyToken(token:string){
    try{
        const {payload} = await jwtVerify(token,secret);
        return payload;
    }catch(err){
        return null;
    }
}
export async function proxy(req:NextRequest){
    const {pathname} = req.nextUrl;

    if(pathname.startsWith("/api/auth")||pathname.startsWith("/_next")||pathname==="/"){
        return NextResponse.next();
    }
    const authHeader = req.headers.get("authorization");

    if(!authHeader){
        if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
        return NextResponse.redirect(new URL("/login",req.url));
    }
    const token = authHeader.split(" ")[1];
    const user = (await verifyToken(token))as {role:string}|null;
   
    if(!user){
        return NextResponse.json({error:'Invalid token'},{status:401});
    }
    if(pathname.startsWith('/api/jobs/create')){
        if(user.role!=='RECRUITER'){
            return NextResponse.json({error:'Forbidden'},{status:403});
    }
}
 return NextResponse.next();
}
    export const config ={
        matcher:["/dashboard/:path*","/api/:path*"],
    };

