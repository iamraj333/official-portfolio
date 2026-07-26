const express = require('express');
const WebUser = require('../MongoDB/UserSchema');
const ContactSchema = require('../MongoDB/ContactSchema')
const MessageSchema = require('../MongoDB/MessageSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const TokenVerification = require('../Middleware/TokenVerification');
const env = require('dotenv');
const AdminTokenVerification = require('../Middleware/AdminTokenVerification');
const cloudinary = require('../config/cloudinary')
const BlogSchema = require('../MongoDB/BlogSchema')
require('dotenv').config()

//creating router
const Router = express.Router()



/* ============================= USER LOGIN & DATA ROUTES ==============================================*/
//Registration
Router.post("/register", async (req, res) => {
    const data = await req.body;

    try {
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            res.json({ error: "fill the form properly" })
        }
        else {
            const isEmailExists = await WebUser.findOne({ email: data.email });
            if (isEmailExists) {
                res.json({ error: "Email is already exists" })
                // process.exit(0)

            }
            else {

                //encrypting the password
                const hashedPassword = await bcrypt.hash(data.password, 10)
                const createUser = await WebUser.create({ name: data.name, email: data.email, password: hashedPassword })
                res.json({ success: "account created successfully" })
            }
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }


})

//Login
Router.post('/login', async (req, res) => {
    const loginData = req.body;

    try {
        const isEmailVerified = await WebUser.findOne({ email: loginData.email })
        if (!isEmailVerified) {
            res.json({ error: "email is not exists" });
        }
        else {
            const isPasswordVerified = await bcrypt.compare(loginData.password, isEmailVerified.password) || isEmailVerified.password == loginData.password
            if (!isPasswordVerified) {
                res.json({ error: "Invalid Credentials" })
            } else {
                const dataForToken = {
                    userId: isEmailVerified._id,
                    email: isEmailVerified.email,
                }
                const isRememberMe = loginData.rememberMe
                const token = await jwt.sign(dataForToken, process.env.TOKEN_SECRET_KEY, { expiresIn: (isRememberMe) ? '30d' : '1h' })
                res.json({
                    success: "Logged in Successfully",
                    token: token,
                    userId: isEmailVerified._id.toString()
                })
            }
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//UserData
Router.get('/userdata', TokenVerification, async (req, res) => {
    const userData = req.user

    try {
        const currentUser = await WebUser.findOne({ email: userData.email })
        res.json({
            userData: userData,
            currentUser: currentUser
        })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internt connection not found" })
    }

})





/* =============================== CONTACT AND MESSAGE ROUTES ===========================================*/
//Contact
Router.post("/contactUs", async (req, res) => {
    const contactData = req.body

    try {
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            res.json({ error: "fill the form data properly" })
        }
        else {
            const isSubjectExists = await ContactSchema.findOne({ subject: contactData.subject })

            if (isSubjectExists) {
                res.json({ error: "subject is already exists" })
            }
            else {
                const createContact = await ContactSchema.create({ name: contactData.name, email: contactData.email, subject: contactData.subject, message: contactData.message })
                res.json({ success: "message submitted successfully" })
            }
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//User all  Messages
Router.get('/user/messages', TokenVerification, async (req, res) => {
    try {
        const AllMessages = await ContactSchema.find()
        res.json({ allMessages: AllMessages });
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//Messages
Router.post('/message', async (req, res) => {
    try {
        const message = req.body;

        const isMessageIsAlreadyExists = await MessageSchema.findOne({ message: message.message });
        if (isMessageIsAlreadyExists) {
            res.json({ error: 'Message is already submitted.' })
        }
        else {
            const saveMessage = await MessageSchema.create({ name: message.name, email: message.email, message: message.message })
            res.json({ success: "Message submitted successfully" })
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//User Normal Messages
Router.get('/user/messages/normal', TokenVerification, async (req, res) => {
    try {
        const AllMessages = await MessageSchema.find()
        res.json({ allMessages: AllMessages });
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

// Delete Contact Messages
Router.delete('/dashboard/contact/delete/:id', TokenVerification, async (req, res) => {
    const contactMessageId = req.params.id;
    try {
        const delMessage = await ContactSchema.deleteOne({ _id: contactMessageId })
        if (delMessage) {
            res.json({ success: "Contact message deleted successfully" })

        }
        else {
            res.json({ error: "Failed to delete contact message" })

        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

// Delete Normal Messages
Router.delete('/dashboard/message/delete/:id', TokenVerification, async (req, res) => {
    const messageId = req.params.id;
    try {
        const delMessage = await MessageSchema.deleteOne({ _id: messageId })
        if (delMessage) {
            res.json({ success: "Message deleted successfully" })

        }
        else {
            res.json({ error: "Failed to delete message" })

        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//Delete Comment
Router.delete('/dashboard/comment/delete/:id', TokenVerification, async (req, res) => {
    const commentId = req.params.id;
    try {
        const Blog = await BlogSchema.find().populate('comments')
        const CommentData = Blog.flatMap((blog) => {
            return blog.comments.filter((comment) => comment._id == commentId)
        })

        if (!CommentData) {
            res.json({ error: "Comment is not exists" })
        }
        let commentOnBlog = null;
        Blog.map(blog => {
            blog.comments.map((comment) => {
                if (comment._id == commentId) {
                    commentOnBlog = blog
                }
            })
        })


        commentOnBlog.comments.pull({ _id: commentId })
        const savedBlog = await commentOnBlog.save()
        if (savedBlog) {
        } else {
            res.json({ error: "Failed to delete comment" })
        }
        res.json({ success: "Comment deleted successfully" })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})


/*======================== ADMIN ROUTES ======================================================*/
//Admin Login
Router.post("/admin/login", async (req, res) => {
    const AdminData = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    try {

        if (AdminData.email != adminEmail || AdminData.password != adminPassword) {
            res.json({ error: "Invalid credentials" })
        }
        else {
            const token = await jwt.sign(AdminData, process.env.ADMIN_TOKEN_SECRET_KEY, {
                expiresIn: `${process.env.ADMIN_TOKEN_EXPIRE}`
            })

            res.json({
                success: "Welcome Admin",
                adminToken: token
            })
        }

    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }


})

//Admin
Router.get("/admin", AdminTokenVerification, async (req, res) => {
    try {
        const AllUserData = await WebUser.find();
        const AllMessages = await ContactSchema.find()
        const AllNormalMessages = await MessageSchema.find()
        res.json({ message: "Welcome Admin", allUserData: AllUserData, allMessages: AllMessages, allNormalMessages: AllNormalMessages })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection not found" })
    }
})


//Admin Users
Router.get('/admin/users', AdminTokenVerification, async (req, res) => {
    try {
        const AllUserData = await WebUser.find();
        res.json({ allUserData: AllUserData })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//Admin calls  Messages
Router.get('/admin/messages', AdminTokenVerification, async (req, res) => {
    try {
        const AllMessages = await ContactSchema.find()
        res.json({ allMessages: AllMessages });
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//User Delete
Router.delete('/admin/users/delete/:id', AdminTokenVerification, async (req, res) => {
    try {
        const id = req.params.id;
        const isDeleteSuccessful = await WebUser.deleteOne({ _id: id })

        if (isDeleteSuccessful) {
            res.json({ success: "User record remove successfully" })
        }
        else {
            res.json({ error: "Failed to remove user record" })
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})


//Contact Delete
Router.delete('/admin/message/delete/:id', AdminTokenVerification, async (req, res) => {
    try {
        const id = req.params.id;
        const isDeleteSuccessful = await ContactSchema.deleteOne({ _id: id })

        if (isDeleteSuccessful) {
            res.json({ success: "Message record remove successfully" })
        }
        else {
            res.json({ error: "Failed to remove message record" })
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//Admin Normal Message
Router.get('/admin/messages/normal', AdminTokenVerification, async (req, res) => {
    try {
        const AllMessages = await MessageSchema.find()
        res.json({ allMessages: AllMessages });
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

//Normal Message Deletion
Router.delete('/admin/message/normal/delete/:id', AdminTokenVerification, async (req, res) => {
    try {
        const messageId = req.params.id;
        const isDeleteSuccessful = await MessageSchema.deleteOne({ _id: messageId })

        if (isDeleteSuccessful) {
            res.json({ success: "Message record remove successfully" })
        }
        else {
            res.json({ error: "Failed to remove message record" })
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }


})




/* ===================================== BLOGS ROUTES ============================================================*/

//Write Blogs
Router.post("/blogs/write_blog", AdminTokenVerification, async (req, res) => {
    const { title, content, excerpt, tags, category } = req.body;
    const tagsArr = tags.split(",")

    try {
        const isBlogAlreadyExists = await BlogSchema.findOne({ title: title })
        const isBlogContentExists = await BlogSchema.findOne({ content: content })
        if (isBlogAlreadyExists || isBlogContentExists) {
            res.json({ error: "Blog is already submitted or exists" })
        }
        else {
            // try {
            //converting HTML text into HTML tag
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM(content)
            const images = dom.window.document.querySelectorAll("img")
            //check IMAGE existence
            if (images.length === 0) {
                res.json({ error: "You must upload at least one image to continue." })
            }
            //getting first image
            else {
                const imgUrl = images[0].src

                //uploading image into cloduinary
                const result = await cloudinary.uploader.upload(imgUrl, {
                    folder: "blog-thumbnails"
                })

                //sending blog data to Mongodb
                const thumbnail = result.secure_url;
                const saveBlogToMongo = await BlogSchema.create({ title: title, excerpt: excerpt, content: content, thumbnail: thumbnail, category: category, tags: tags })

                if (saveBlogToMongo) {
                    res.json({ success: "Blog submitted successful." })
                }
                else {
                    res.json({ error: "Blog submission failed." })
                    console.error("Blog Submission failed")
                }
            }

            // }
            // catch (e) {
            //     res.json({ error: "Submission process failed" })
            // }
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
        console.log(e)
    }
})

//Blogs
Router.get("/blogs", async (req, res) => {
    try {
        const blogData = await BlogSchema.find().populate('comments.user likes dislikes')
        res.json(blogData)
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection not found" })
    }
})

//Read Blogs
Router.get("/blogs/read/:id", async (req, res) => {
    const id = req.params.id
    try {
        const blogDataSpecificId = await BlogSchema.findOne({ _id: id }).populate("comments.user")
        blogDataSpecificId.views += 1;
        await blogDataSpecificId.save()
        res.json(blogDataSpecificId)
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection is found" })
    }
})

//Update Blogs
Router.patch("/admin/blogs/edit/:id", AdminTokenVerification, async (req, res) => {
    const updatedData = req.body;
    const blogId = req.params.id
    if (!updatedData) {
        res.json({ error: "Data is not found" })
    }
    else {
        try {
            const updateBlog = await BlogSchema.findByIdAndUpdate(
                blogId,
                {
                    title: updatedData.title,
                    excerpt: updatedData.excerpt,
                    content: updatedData.content
                }
            )
            if (updateBlog) {
                res.json({ success: "Blog edited succcessfully" })
            }
            else {
                res.json({ error: "Failed to edit blog" })
            }
        }
        catch (e) {
            res.status(200).json({ internetError: "Internet connection failed" })
        }
    }

})

//Delete Blog
Router.delete('/admin/blogs/delete/:id', AdminTokenVerification, async (req, res) => {
    const blogId = req.params.id;
    if (!blogId) {
        res.json({ error: "Blog is not exists" })
    }
    else {
        try {
            const deleteBlog = await BlogSchema.findByIdAndDelete(blogId);
            if (deleteBlog) {
                res.json({ success: "Blog deleted successfully" })
            }
            else {
                res.json({ error: "Failed to delete blog" })
            }
        }
        catch (e) {
            res.status(200).json({ internetError: "Internet connection failed" })
        }
    }
})


//User comments
Router.post('/blogs/read/:id/comment', TokenVerification, async (req, res) => {
    const blogId = req.params.id;
    const { content } = req.body;
    const userData = req.user; //this is comming from TokenVerification middleware

    try {
        const Blog = await BlogSchema.findOne({ _id: blogId })

        if (!Blog) {
            res.json({ error: "Blog is not exists" })
        }
        else {
            Blog.comments.push({
                content: content,
                user: userData.userId,
            })

            await Blog.save();
            res.json({ success: "Comment added successfully" })
        }
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

// Blog Like
Router.post('/blogs/like/:id', TokenVerification, async (req, res) => {
    const blogId = req.params.id;
    const user = req.user;
    try {
        const Blog = await BlogSchema.findOne({ _id: blogId }).populate("likes")
        const isLikesExists = Blog.likes.map((like) => like.email == user.email)
        if (isLikesExists) {
            Blog.likes.pull(user.userId)
            // Blog.dislikes.pull(user.userId)
        }
        Blog.likes.push(user.userId)
        Blog.dislikes.pull(user.userId)
        await Blog.save()
        res.json({ success: "Like is done" })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})

// Blog DisLike
Router.post('/blogs/dislike/:id', TokenVerification, async (req, res) => {
    const blogId = req.params.id;
    const user = req.user;
    try {
        const Blog = await BlogSchema.findOne({ _id: blogId }).populate("dislikes")
        const isDislikesExists = Blog.dislikes.map((like) => like.email == user.email)
        if (isDislikesExists) {
            Blog.dislikes.pull(user.userId)
            // Blog.likes.pull(user.userId)
        }
        Blog.dislikes.push(user.userId)
        Blog.likes.pull(user.userId)
        await Blog.save()
        res.json({ success: "Dislike is done" })
    }
    catch (e) {
        res.status(200).json({ internetError: "Internet connection failed" })
    }
})


module.exports = Router