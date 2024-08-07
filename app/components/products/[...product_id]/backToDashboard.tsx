'use client'

import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

const route = process.env.NEXT_PUBLIC_ROUTE;

export default function BackToDashboard(){
    const [users, setUsers] = useState<Users[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const token = getCookie("token");
    const email = getCookie("email");

    async function getUserDetail(token: string, email: string){
        let user: Users[] = [{
            id: 0,
            name: "",
            email: "",
            password: "",
            gender: "",
            role: ""
        }];    
        try {             
            const response = await fetch(`${route}/userDetail`, {
                method: 'POST',
                headers:{
                    'Authorization': 'Bearer '+ token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });
            const content = await response.json();
            
            user = content.data;
            
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    
        return user;
    }
    function handleBackDashboard(){
        if(isAdmin){
            return router.push("/admin");
        }else{
            return router.push("/products?category=Phone");
        }
        
    }
    useEffect(()=>{
        
        const fetchData =  async ()=>{
            
            const users:Users[] = await getUserDetail(token!, email!);
            setUsers(users);
            if(users[0].role == "Admin"){
                setIsAdmin(true);
            }
        }
        fetchData();
    }, []);
   
    return (
        <>
        <a onClick={handleBackDashboard}><button className="btn btn-outline btn-sm">&lt; Back To Dashboard</button></a>
        </>
    )
}