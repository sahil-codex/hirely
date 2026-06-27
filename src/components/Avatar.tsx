"use client";

type AvatarProps = {
    name?:string;
};
export default function Avatar({name = "User"}:AvatarProps){
    return (
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center text-white font-semibold cursor-pointer hover:scale-105 transition">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}