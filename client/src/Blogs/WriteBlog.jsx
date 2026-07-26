import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Editor } from '@tinymce/tinymce-react'
import Loading from "../Loading";
import Swal from "sweetalert2";
import { ContextAPIData } from "../ContextData/ContentAPIData";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import NoInternet from "../NoInternet";

export default function WriteBlog() {
    const { adminToken } = useContext(ContextAPIData)
    const tinymceAPIKey = import.meta.env.VITE_TINYMCE_API_KEY;
    //checking is has params or not
    const BlogId = useParams().id;
    let blogEditData = [];

    const navigate = useNavigate();

    const [blogContent, setBlogContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [content, setContent] = useState("")
    const [isInternet, setIsInternet] = useState(true)

    //Fetching all Blogs
    const RetriveBlogData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs`, {
                method: "GET",
            })

            const data = await response.json()
            if (data.internetError) {
                setIsInternet(false)
            }
            if (response.ok) {
                setBlogContent(data)
            }
        }
        catch (e) {
            console.error("Failed in Server communication")
            showToast("error","Failed in Server communication")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        RetriveBlogData()
    }, [])



    if (BlogId && !isLoading && blogContent) {
        const filterBlogWithId = blogContent.filter((blog) => blog._id === BlogId);
        blogEditData = [...filterBlogWithId]

    }

    useEffect(() => {
        if (blogContent.length === 0) return;


        setTitle(blogEditData[0]?.title || "")
        setExcerpt(blogEditData[0]?.excerpt ?? "")
        setCategory(blogEditData[0]?.category || "")
        setTags(blogEditData[0]?.tags || "")
        setContent(blogEditData[0]?.content || "")
    }, [blogContent, BlogId])




    //Swal Toast
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

    const editorRef = useRef(null)

    //Handling publish function
    const publishHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!editorRef.current) return;
        let editorContent = editorRef.current.getContent()
        setContent(editorContent)

        const newData = {
            title: title,
            content: editorContent,
            excerpt: excerpt,
            category: category,
            tags: tags
        }

        if (newData.title == "" || newData.content == "" || newData.excerpt == "" || newData.category == "" || newData.tags == "") {
            showToast("error", "Something missing, please fill correctly")
            setIsLoading(false)
        }
        else {
            try {
                const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs/write_blog`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        token: adminToken
                    },
                    body: JSON.stringify(newData)
                });

                const data = await response.json();

                if (data.internetError) {
                    // setIsInternet(false)
                    showToast("error", data.internetError)
                }
                else {
                    if (data.adminTokenExpire) {
                        localStorage.removeItem('AdminToken')
                    }
                    if (data.success) {
                        showToast("success", data.success)
                        navigate("/blogs")
                    }
                    else {
                        showToast("error", data.error)
                    }
                }
            }
            catch (e) {
                console.error('Failed to send blog ')
                showToast("error", "Failed to send blog")
            }
            finally {
                setIsLoading(false)
            }
        }
    }


    //handling edit function
    const editHandler = async (editBlogId, e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!editorRef.current) return;
        let editorContent = editorRef.current.getContent()
        setContent(editorContent)

        const newData = {
            title: title,
            content: editorContent,
            excerpt: excerpt,
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/blogs/edit/${editBlogId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    token: adminToken
                },
                body: JSON.stringify(newData)
            });

            const data = await response.json();

            if (data.internetError) {
                showToast("error", data.internetError)
            }
            else {
                if (data.success) {
                    showToast("success", data.success)
                    navigate("/admin/blogs")
                }
                if (data.adminTokenExpire) {
                    localStorage.removeItem('AdminToken')
                }
            }
        }
        catch (e) {
            console.error('Failed to send blog ')
            showToast("error",'Failed to send blog ')
        }
        finally {
            setIsLoading(false)
        }

    }

    //check if token exist or not
    if (!adminToken) {
        return <Navigate to={"/admin/login"} state={{ warning: "Login to write blog" }}></Navigate>
    }

    return (
        <>
            {isLoading && <Loading />}
            <Navbar />

            {
                isInternet ? (
                    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col font-sans relative overflow-hidden pb-8">
                        <main className="flex-grow relative z-10">

                            {/* HERO */}
                            <section className="max-w-5xl mx-auto px-4 pt-5 pb-6 text-center">

                                <p className="text-blue-400 tracking-widest uppercase text-sm mb-3">
                                    Admin Editor
                                </p>

                                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-zinc-100 to-indigo-500 bg-clip-text text-transparent">
                                    {
                                        BlogId ? "Edit Your Post" : "Write a New Post"
                                    }
                                </h1>

                                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                                    Create blogs, tutorials, and stories to share your ideas with the world.
                                </p>
                            </section>
                        </main>

                        <div className="max-w-[1200px] mx-auto">
                            {/* Title */}
                            <div className="my-2">
                                <h3 className="text-md font-semibold mb-2">Blog Title:</h3>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="blogTitle" className="outline-none p-4 rounded-lg bg-[#222f3e] w-full" />
                            </div>
                            {/* Excerpt */}
                            <div className="mt-4">
                                <label className="block text-md font-semibold mb-2 text-gray-100">Short Description</label>
                                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} name="excerpt" rows="4" placeholder="Write a short summary that appears on blog cards..." className="w-full px-4 py-3 bg-[#222f3e]  rounded-xl outline-none resize-none" />
                                <p className="text-xs text-gray-500 "> Keep it short and engaging (maximum 250 characters).</p>
                            </div>

                            {/* Category and tags */}
                            <div className="grid grid-cols-2 gap-4 justify-between my-4">
                                {/* Category */}
                                <div>
                                    <h3 className="text-md font-semibold mb-2">Category</h3>
                                    <select disabled={BlogId ? true : false} value={category} onChange={(e) => setCategory(e.target.value)} name="blogCategory" id="blogCategory" className="px-4 py-3 rounded bg-[#222f3e] outline-none ">
                                        <option value="">Select Category</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Tips & Tricks">Tips & Tricks</option>
                                        <option value="Tutorials">Tutorials</option>
                                        <option value="Projects">Projects</option>
                                        <option value="Case Studies">Case Studies</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Tools & Resources">Tools & Resources</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Career & Learning">Career & Learning</option>
                                        <option value="Personal Story">Personal Story</option>
                                        <option value="Experience">Experience</option>
                                        <option value="Open Source">Open Source</option>
                                    </select>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-md font-semibold mb-2 text-gray-100">Tags</label>

                                    <input disabled={BlogId ? true : false} value={tags} onChange={(e) => setTags(e.target.value)} type="text" name="tags" placeholder="React, Node.js, MongoDB, JavaScript" className={`w-full px-4 py-3 rounded bg-[#222f3e] outline-none border-none ${BlogId ? "bg-[#161f29] text-zinc-400" : "bg-[#222f3e]"}`} />

                                    <p className="text-xs text-gray-500 mt-2"> Add multiple tags separated by commas.</p>
                                </div>
                            </div>

                            {/* EDITOR */}
                            <div>
                                <h3 className="text-md font-semibold mb-2">Blog Content:</h3>
                                <Editor
                                    apiKey={tinymceAPIKey}
                                    onInit={(evt, editor) => {
                                        editorRef.current = editor;
                                    }}
                                    value={content}
                                    onEditorChange={(newValue) => {
                                        setContent(newValue);
                                    }}
                                    init={{
                                        height: 400,
                                        menubar: true,
                                        plugins: [
                                            "lists",
                                            "link",
                                            "image",
                                            "table",
                                            "code",
                                            "wordcount",
                                            "autolink",
                                            "preview",
                                            "fullscreen",
                                            "searchreplace",
                                            "insertdatetime",
                                            "media",
                                            "codesample",
                                            "help",
                                            "emoticons",
                                        ],

                                        toolbar:
                                            "undo redo | blocks | bold italic underline | " +
                                            "alignleft aligncenter alignright | bullist numlist | " +
                                            "link image media table | codesample | code fullscreen preview",

                                        branding: false,
                                        promotion: false,
                                        skin: "oxide-dark",
                                        content_css: "default",

                                        automatic_uploads: true,
                                        file_picker_types: "image",

                                        file_picker_callback: (callback) => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";

                                            input.onchange = () => {
                                                const file = input.files?.[0];
                                                if (!file) return;

                                                const reader = new FileReader();

                                                reader.onload = () => {
                                                    callback(reader.result, {
                                                        alt: file.name,
                                                    });
                                                };

                                                reader.readAsDataURL(file);
                                            };

                                            input.click();
                                        },
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            {
                                !BlogId ? (
                                    <div className="mt-2 flex float-right gap-3">
                                        <button onClick={publishHandler} className="bg-blue-600 p-3 px-10 rounded mt-2 hover:bg-blue-700">Publish</button>
                                        <button className="bg-red-600 p-3 px-10 rounded mt-2 hover:bg-red-700">Reset</button>
                                    </div>
                                ) : (
                                    <div className="mt-2 flex float-right gap-3">
                                        <button onClick={(e) => editHandler(blogEditData[0]._id, e)} className="bg-blue-600 p-3 px-10 rounded mt-2 hover:bg-blue-700">Edit</button>
                                        <button onClick={() => navigate(-1)} className="bg-red-600 p-3 px-10 rounded mt-2 hover:bg-red-700">Cancel</button>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                ) : (<NoInternet />)
            }

            <Footer />

        </>
    );
}