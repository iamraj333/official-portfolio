import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { Navigate } from "react-router-dom";

//create context
export const ContextAPIData = createContext()

//sending data to each component
export const ContextDataProvider = ({ children }) => {

    //setting token and check either is already in localstorage or not
    const [userToken, setUserToken] = useState(localStorage.getItem("MyToken") || null)
    const [adminToken, setAdminToken] = useState(localStorage.getItem("AdminToken") || "")
    let isUserHasToken = userToken ? true : false
    const [userData, setUserData] = useState("")
    const [currentUser, setCurrentUser] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isBlogLoading, setIsBlogLoading] = useState(true)
    const [blogContent, setBlogContent] = useState([]);

    //Storing user token
    const storeTokenInLocalStorage = async (token) => {
        localStorage.setItem("MyToken", token)
        setUserToken(token)
    }

    //Storing Admin token
    const storeAdminTokenInLocalStorage = async (adminToken) => {
        localStorage.setItem("AdminToken", adminToken)
        setAdminToken(adminToken)
    }

    //Handling logout 
    const logoutUser = () => {
        if (isUserHasToken) {
            localStorage.removeItem("MyToken")
            setUserToken("")
            setUserData("")
            setCurrentUser("")
            isUserHasToken = false;
        }
        if (adminToken) {
            localStorage.removeItem("AdminToken")
            setAdminToken("")
        }
    }

    //Checking current user data
    const Authentication = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/userdata`, {
                method: "GET",
                headers: {
                    token: userToken
                }
            })

            const responseData = await response.json()
            if (response.ok) {
                setUserData(responseData.userData)
                setCurrentUser(responseData.currentUser)
                
            }
            if (responseData.userTokenExpireError) {
                localStorage.removeItem('MyToken')
                setUserToken(null)
                setCurrentUser("")
                setUserData("")
            }
        }
        catch (e) {
            console.error("Server communication failed in user verification")
            setCurrentUser("")
            setUserData("")
        }
        finally {
            setIsLoading(false)
        }
    }
    //Handling the authentication reques using useeffect to prevent unwanter rendering
    useEffect(() => {

        if (!userToken) {
            setIsLoading(false)
            return;
        }
        Authentication()
    }, [userToken])

    //Fetching all Blogs
    const RetriveBlogData = async () => {
        try {
            setIsBlogLoading(true)
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs`, {
                method: "GET",
            })

            const data = await response.json()
            if (data.internetError) {
                setBlogContent([])
            }
            else {
                setBlogContent(data)
            }
        }
        catch (e) {
            console.error("Failed in Server Communication")
        }
        finally {
            setIsBlogLoading(false)
        }
    }

    //Handling the fetching blogs using useEffect()
    useEffect(() => {
        if (adminToken) {
            RetriveBlogData()
        }
        else {
            setIsBlogLoading(false)
        }
    }, [adminToken])


    //sending data to all child component
    return (
        <ContextAPIData.Provider value={{ blogContent, isUserHasToken, isLoading, currentUser, userData, logoutUser, userToken, adminToken, storeTokenInLocalStorage, storeAdminTokenInLocalStorage }}>
            {children}
        </ContextAPIData.Provider>
    )
}