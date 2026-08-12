import { useContext } from "react"
import { ContextAPIData } from "./ContextData/ContentAPIData"
import { Navigate, useFetcher } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Logout() {
    const { currentUser, isUserHasToken, adminToken, userToken} = useContext(ContextAPIData)
    const showToast = (icon, title) => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    };
    if(!userToken && !adminToken){
        return <Navigate to={"/login"}></Navigate>
    }
    if (isUserHasToken) {
        const { logoutUser } = useContext(ContextAPIData)
        useEffect(() => {
            logoutUser();
            showToast('warning', "You're logged out")
        }, [logoutUser])
        return <Navigate to={"/login"}></Navigate>
    }
    if (adminToken) {
        const { logoutUser } = useContext(ContextAPIData)
        useEffect(() => {
            logoutUser();
            showToast('warning', "You're logged out")
        }, [logoutUser])
        return <Navigate to={"/admin/login"}></Navigate>
    }

}