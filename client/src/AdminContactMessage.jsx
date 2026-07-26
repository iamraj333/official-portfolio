import { useContext, useEffect, useState } from "react";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import Swal from "sweetalert2";
import { Link, Navigate, Outlet } from "react-router-dom";

export default function AdminContactMessage() {
    const { userToken, adminToken } = useContext(ContextAPIData);
    const [adminMessages, setAdminMessages] = useState([]);
    const [normalMessage, setNormalMessage] = useState([])
    const [isInternet, setIsInternet]=useState(true)


    const getAllContactMessage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/messages`, {
                method: "GET",
                headers: {
                    token: adminToken
                }
            })

            const data = await response.json()
            if(data.internetError){
                setIsInternet(false)
            }
            setAdminMessages(data.allMessages);
        }
        catch (e) {
            console.error("Something went wrong in contactmessage fetching ")
        }

    }

    const getNormalMessage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/messages/normal`, {
                method: "GET",
                headers: {
                    token: adminToken
                }
            })

            const data = await response.json()
            if(data.internetError){
                setIsInternet(false)
            }
            setNormalMessage(data.allMessages);
        }
        catch(e){
            console.error("Something went wrong in normal message fetching ")
        }

    }

    useEffect(() => {
        getAllContactMessage()
        getNormalMessage()
    }, [])

    if (!adminToken) {
        return <Navigate to={"/admin/login"} state={{ warning: "Loggin to access admin panel" }}></Navigate>
    }

    return (
        <>
            <div className="w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Messages
                            </h2>

                            <div className="mt-4 inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-900 p-1">
                                <Link
                                    to="/admin/messages/contact"
                                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${location.pathname === "/admin/message/contact"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    Contact
                                </Link>
                                <span className="mx-2"> | </span>
                                <Link
                                    to="/admin/messages/normal"
                                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${location.pathname === "/admin/message/normal"
                                        ? "bg-green-600 text-white shadow-lg"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    Normal
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        Total: {isInternet ? ((adminMessages.length) + (normalMessage.length)) : 0}
                    </div>
                </div>

                <div className="space-y-5">
                    <Outlet />
                </div>
            </div>


            {/* POP-UP button */}

        </>
    );
}