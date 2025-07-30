import { useMutation } from "@tanstack/react-query"
import axios from "axios"


interface ILoginPayload{
    email:string
    password:string
}
export const useLogin=()=>{
    return useMutation({
        mutationFn:async(payload:ILoginPayload)=>{
const {data}= await axios.post(`https://whatsappapi.qwizfun.com/api/admin/login`, payload)
return data        
}
    })
}