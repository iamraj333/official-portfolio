import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
    //context currentUser Data
    const {userToken}=useContext(ContextAPIData)
    const currentUser = useContext(ContextAPIData)
    const navigate=useNavigate();

    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    //isloading
    const [isLoading, setIsLoading]=useState(false)

    useEffect(() => {
        if (currentUser?.currentUser) {
            setContactData({
                name: currentUser?.currentUser?.name,
                email: currentUser?.currentUser?.email,
                subject: "",
                message: ""
            })
        }
    }, [currentUser?.currentUser])

    const contactInputChangeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setContactData({
            ...contactData,
            [name]: value
        })
    }

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

    const ContactFormSubmitHandler = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        if(!userToken){
            showToast("error", "please loggin to send me contact message")
            setIsLoading(false)
            return;
        }
        if(contactData.message.split("").length<20 || contactData.subject.split("").length<5){
            showToast("error","message or subject is too short")
            setIsLoading(false)
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/contactUs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            })

            const responseMessages=await response.json()
            
            if(responseMessages.success){
                showToast("success", `${responseMessages.success}`)
                setContactData({name: "",email: "",subject: "",message: ""})
                navigate("/")
            }
            else{
                showToast("error",`${responseMessages.error}`)
            }
        }
        catch (e) {
            console.error("Failed to send contact data to server")
            showToast("error","Failed to send contact data to server")
        }
        finally{
            setIsLoading(false)
        }
    }



    return (
        <>
            <Navbar />
            
            {
                isLoading && <Loading/>
            }

            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f17] px-4 py-12 pt-6">

                {/* OUTSIDE HEADING */}
                <div className="text-center max-w-2xl mb-6">

                    <h1 className="text-4xl font-bold text-white mb-3">
                        Get In Touch
                    </h1>

                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                        Have a project idea or collaboration in mind? Send a message and I’ll get back to you soon.
                    </p>

                </div>

                {/* MAIN CARD */}
                <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 shadow-2xl">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex flex-col justify-center p-12 py-4 bg-gradient-to-br from-[#0f172a] to-[#0b0f17] relative">

                        <div className="absolute w-72 h-72 bg-[#3b82f6]/20 blur-3xl rounded-full top-10 left-10"></div>

                        <h1 className="text-zinc-100 text-4xl font-bold mb-4 relative">
                            Let’s Build Something <span className="text-[#3b82f6]">Amazing</span>
                        </h1>

                        <p className="text-[#9ca3af] mb-8 leading-relaxed relative">
                            I’m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                        </p>

                        <div className="space-y-4 text-sm text-[#9ca3af] relative">

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Fast response within 24–48 hours
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Open for freelance & collaboration
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Full-stack development support
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE FORM */}
                    <div className="p-10 py-4 bg-[#111827]">

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Contact Me
                        </h2>

                        <p className="text-[#9ca3af] text-sm mb-8">
                            Fill the form below and I’ll reply as soon as possible
                        </p>

                        <form onSubmit={ContactFormSubmitHandler} className="space-y-5">

                            <input
                                type="text"
                                name="name"
                                onChange={contactInputChangeHandler}
                                value={contactData.name}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <input
                                type="email"
                                name="email"
                                onChange={contactInputChangeHandler}
                                value={contactData.email}
                                placeholder="Your Email"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <input
                                type="text"
                                name="subject"
                                onChange={contactInputChangeHandler}
                                placeholder="Subject"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <textarea
                                rows="5"
                                name="message"
                                onChange={contactInputChangeHandler}
                                placeholder="Your Message..."
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none resize-none"
                            ></textarea>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition font-medium text-white"
                            >
                                Send Message
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}