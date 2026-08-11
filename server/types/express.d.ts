import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            auth: ()=> {userId: string ; has: (permission: any)=> boolean};
            plans?:string;
            file:any;
        }
    }
}