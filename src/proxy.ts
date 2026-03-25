// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import {jwtVerify} from "jose";
// import path from "path";

// const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
// async function verifyToken(token){
//     try{
//         const {payload} = await jwtVerify(token,secret);
//         return payload;
//     }catch(err){
//         return null;
//     }
// }
// export async function proxy(req:NextRequest){
//     const {pathname} = req.nextUrl;

//     if(pathname.startsWith("/api/auth")||pathname.startsWith("/_next")||pathname==="/"){
//         return NextResponse.next();
//     }
//     const token = req.cookies.get("token")?.value;

//     if(!token){
//         return NextResponse.redirect(new URL("/login",req.url));
//     }

//     try{
//         const {payload} = await jwtVerify(token,secret);
//         if(pathname.startsWith("/admin")&& payload.role !=="ADMIN"){
//         return NextResponse.redirect(new URL("/",req.url));
//     }
//        return NextResponse.next();
//    }catch{
//         return NextResponse.redirect(new URL("/login",req.url));
//     }
// }
//     export const config ={
//         matcher:["/dashboard/:path*","/api/:path*"],
//     };
