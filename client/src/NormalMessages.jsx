import { useContext, useEffect, useState } from "react";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import Swal from "sweetalert2";
import Loading from "./Loading";

export default function NormalMessages() {
    const { userToken, adminToken } = useContext(ContextAPIData)
    const [adminMessages, setAdminMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isInternet, setIsInternet] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const getAllUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/messages/normal`, {
            method: "GET",
            headers: {
                token: adminToken
            }
        })

        const data = await response.json()
        if (data.internetError) {
            setIsInternet(false)
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
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/message/normal/delete/${messageId}`, {
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
                    selectedMessage(null);
                }

                if (data.adminTokenExpire) {
                    localStorage.removeItem('AdminToken')
                }
            }

        }
        catch (e) {
            console.error("Failed to connect server")
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
            {isLoading && <Loading />}
            <div>
                <h2 className="text-lg font-semibold mb-2">Normal Messages</h2>
                <div className="space-y-5">
                    {
                        isInternet ? (
                            <>
                                {(adminMessages.length > 0 && isInternet) ? (
                                    adminMessages.map((message) => (
                                        <div
                                            key={message._id}
                                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 transition hover:border-zinc-700"
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-white font-semibold text-base sm:text-lg">
                                                        {message.name}
                                                    </p>

                                                    <p className="text-zinc-400 text-sm break-all">
                                                        {message.email}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                                                    {
                                                        (message.createdAt) ? (new Date(message.createdAt).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })) : "Not Found"
                                                    }
                                                </span>
                                            </div>

                                            {/* Message */}
                                            <div className="mt-4">
                                                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                                    {message.message}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-5 flex gap-3">
                                                <button
                                                    onClick={(e) => handleView(message, e)}
                                                    className="flex-1 text-sm sm:flex-none px-4 py-2 rounded bg-blue-600/10 text-blue-400 border border-blue-500 hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(message._id)}
                                                    className="flex-1 text-sm sm:flex-none px-4 py-2 rounded bg-red-600/10 text-red-400 border border-red-500 hover:bg-red-600 hover:text-white transition"
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
                                No Internet Connection.
                            </div>
                        )
                    }
                </div>
            </div>

            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div onClick={(e) => { e.stopPropagation() }} className="w-full max-w-3xl rounded-xl bg-zinc-900 border border-zinc-800 p-6">

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

                                            // 👉 call your API here

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