import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {jwtVerify} from "jose";

const secretkey = process.env.JWT_SECRET;
if(!secretkey){
    throw new Error("JWT_SECRET is not defined");
}
const secret = new TextEncoder().encode(secretkey);
const publicApiRoutes = ["/api/jobs/search"];
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
    const token = req.cookies.get("token")?.value||
                  (req.headers.get("authorization")?.startsWith("Bearer ")
                  ?req.headers.get("authorization")?.split(" ")[1]:null);

        const isPublicApi = publicApiRoutes.some((route)=>pathname.startsWith(route));
     if(!token){
        if(isPublicApi){
        return NextResponse.next();
       }
        if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
        return NextResponse.redirect(new URL("/login",req.url));
    }
    const user = (await verifyToken(token))as {role:string}|null;
   
    if(!user){
        if(pathname.startsWith("/api")){
        return NextResponse.json({error:'Invalid token'},{status:401});
    }
     return NextResponse.redirect(new URL("/login",req.url));
}
   if(isPublicApi){
    return NextResponse.next();
   }
     if(pathname.startsWith('/api/jobs/create')){
        if(user.role!=='RECRUITER'){
            return NextResponse.json({error:'Forbidden'},{status:403});
    }
}
     if(pathname.startsWith("/api/jobs/apply")){
        if(user.role !=="CANDIDATE"){
            return NextResponse.json({error:"Forbidden"},{status:403});
        }
     }
 return NextResponse.next();
}
    export const config ={
        matcher:["/dashboard/:path*","/api/:path*"],
    };

