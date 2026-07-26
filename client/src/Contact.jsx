import React, { useContext, useEffect, useState } from 'react';
import { ContextAPIData } from './ContextData/ContentAPIData';
import Swal from 'sweetalert2';
import Loading from './Loading';

export default function Contact() {
  const { currentUser } = useContext(ContextAPIData);
  const [isLoading, setIsLoading] = useState(false)
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: ""
  })

  useEffect(() => {
    if (currentUser) {
      setContactData({
        name: currentUser?.name,
        email: currentUser?.email,
        message: ""
      })
    }
  }, [currentUser])

  const InputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
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



  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if(contactData.message.split("").length<10){
      showToast("error", "message is too short")
      setIsLoading(false)
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      })



      if (response.ok) {
        const data = await response.json();
        if (data.internetError) {
          showToast("error", data.internetError)
        }
        else {
          if (data.success) {
            showToast('success', data.success)
          }
          else {
            showToast('error', data.error)
          }
        }
      }
    }
    catch (e) {
      console.error("Server communication failed")
      showToast("error", "Server communication failed")
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {
        isLoading && <Loading />
      }
      <section id="contact" className="border-t border-gray-800 py-20">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Get In Touch</h2>
            <p className="text-sm text-gray-400">
              Have an interesting project or a general inquiry? Drop a secure transmission below.
            </p>
          </div>

          <form onSubmit={formSubmitHandler} className="space-y-5 bg-[#111827] border border-gray-800 p-6 rounded-xl">
            <div>
              <label htmlFor="name" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-2">Your Name</label>
              <input onChange={InputChangeHandler} name='name' value={contactData.name} type="text" id="name" required className="w-full px-4 py-3 bg-[#0b0f17] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="Alex Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-2">Email Address</label>
              <input onChange={InputChangeHandler} name='email' value={contactData.email} type="email" id="email" required className="w-full px-4 py-3 bg-[#0b0f17] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="alex@domain.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-2">Message Payload</label>
              <textarea onChange={InputChangeHandler} name='message' value={contactData.message} id="message" rows="5" required className="w-full px-4 py-3 bg-[#0b0f17] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors resize-none" placeholder="Details about your architecture timeline..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-[#3b82f6] text-white font-medium text-sm hover:bg-[#2563eb] transition-colors shadow-sm">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}