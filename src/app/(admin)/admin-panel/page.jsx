'use client'
import Navbar from "../../components/Navbar";
import { useEffect,useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default  function Admin () {
     const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const router = useRouter();

useEffect(() => {
   const userData = Cookies.get('user');

   if (userData){
    try{
        const user = JSON.parse(userData)

        setTimeout(() => {
                    setIsLoggedIn(true);
                }, 0);
        
        if (user.role !== 'admin') {
          router.push('/');
        }
          } catch (error) {
                console.error("แกะกล่อง JSON ไม่สำเร็จ:", error);
            }
        } else {
          setTimeout(() => {
                    setIsLoggedIn(false);
                    router.push('/');
                }, 0);
        }

     }, []);
     
     if (!isLoggedIn) return null;

    return (
        <Navbar/>
    )
}