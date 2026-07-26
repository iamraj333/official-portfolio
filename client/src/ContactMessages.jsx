import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import Loading from "./Loading";

export default function ContactMessages() {
    const { userToken, adminToken } = useContext(ContextAPIData)
    const [adminMessages, setAdminMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isInternet, setIsInternet] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const getAllUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/messages`, {
            method: "GET",
            headers: {
                token: adminToken
            }
        })

        const data = await response.json()
        if (data.internetError) {
            setIsInternet(false)
        }
        if(data.adminTokenExpire){
            localStorage.removeItem('AdminToken')
        }
        setAdminMessages(data.allMessages);

    }

    useEffect(() => {
        getAllUser()
    }, [])

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

    const handleDelete = async (messageId) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/message/delete/${messageId}`, {
                method: 'DELETE',
                headers: {
                    token: adminToken
                }
            })

            const data = await response.json();
            if (data.internetError) {
                showToast("error", data.internetError)
            }
            else {
                if (data.success) {
                    showToast('success', `${data.success}`)
                    getAllUser();
                    setSelectedMessage(null);
                }
                if (data.adminTokenExpire) {
                    localStorage.removeItem('AdminToken')
                }
            }
        }
        catch (e) {
            console.error("Failed in Handling message delete")
            showToast("error","Failed in Handling message delete")
        }
        finally {
            setIsLoading(false)
        }
    }

    document.addEventListener('click', () => {
        setSelectedMessage(null)
    })

    const handleView = (message, e) => {
        e.stopPropagation();
        setSelectedMessage(message);
        setIsReplying(false);
        setReplyText("");

    }
    return (
        <>
        {
            isLoading && <Loading/>
        }
            <div>
                <h2 className="text-lg font-semibold mb-2">Contact Messages</h2>
                <div className="space-y-5">
                    {
                        (isInternet) ? (
                            <>
                                {(adminMessages.length > 0) ? (
                                    adminMessages.map((message) => (
                                        <div
                                            key={message._id}
                                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-4 space-y-3"
                                        >

                                            {/* Top row */}
                                            <div className="flex items-center justify-between gap-3">

                                                <h3 className="text-white text-base font-medium truncate">
                                                    {message.subject || "No Subject"}
                                                </h3>

                                                <span className="shrink-0 text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                                                    {message.createdAt
                                                        ? new Date(message.createdAt).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "Not Found"}
                                                </span>

                                            </div>

                                            {/* Info */}
                                            <p className="text-sm text-zinc-400 truncate">
                                                {message.name} • {message.email}
                                            </p>

                                            {/* Message */}
                                            <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                                {message.message}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-1">

                                                <button
                                                    onClick={(e) => handleView(message, e)}
                                                    className="px-3 py-1.5 text-sm rounded border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(message._id)}
                                                    className="px-3 py-1.5 text-sm rounded border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-dashed border-zinc-700 py-20 text-center text-zinc-500">
                                        No contact messages found.
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-zinc-700 py-20 text-center text-zinc-500">
                                Internet Connection Failed.
                            </div>
                        )
                    }
                </div>
            </div>

            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div onClick={(e) => { e.stopPropagation() }} className="w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 p-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {isReplying ? "Reply Message" : "Message Details"}
                            </h2>

                            <button
                                onClick={() => {
                                    setSelectedMessage(null);
                                    setIsReplying(false);
                                    setReplyText("");
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 text-zinc-300">

                            <p><span className="text-zinc-500">Name:</span> {selectedMessage.name}</p>
                            <p><span className="text-zinc-500">Email:</span> {selectedMessage.email}</p>
                            <p><span className="text-zinc-500">Subject:</span> {selectedMessage.subject}</p>

                            {/* Original Message */}
                            <div>
                                <p className="text-zinc-500 mb-1">Message:</p>
                                <p className="bg-zinc-800 p-3 rounded-lg text-zinc-200">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {/* Reply Box */}
                            {isReplying && (
                                <div>
                                    <p className="text-zinc-500 mb-1">Your Reply:</p>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={5}
                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-3 text-white outline-none focus:border-blue-500"
                                        placeholder="Write your reply..."
                                    />
                                </div>
                            )}

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">

                            {!isReplying ? (
                                <>
                                    <button
                                        onClick={() => setIsReplying(true)}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                                    >
                                        Reply
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsReplying(false);
                                            setReplyText("");
                                        }}
                                        className="rounded-md border border-zinc-600 px-4 py-2 text-zinc-300 hover:bg-zinc-800 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsReplying(false);
                                            setReplyText("");
                                            setSelectedMessage(null);
                                        }}
                                        disabled={!replyText.trim()}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 transition"
                                    >
                                        Send Reply
                                    </button>
                                </>
                            )}

                        </div>

                    </div>
                </div>
            )}
        </>
    )
}