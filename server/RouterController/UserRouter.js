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
const { Resend } = require('resend')
const crypto = require('node:crypto')
const Redis = require('ioredis')
const { validate } = require('deep-email-validator');

//creating router
const Router = express.Router()



/* ============================= USER LOGIN & DATA ROUTES ==============================================*/
//Registration
Router.post("/register", async (req, res) => {
    const data = await req.body;

    try {
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            return res.json({ error: "fill the form properly" })
        }
        else {
            const isEmailExists = await WebUser.findOne({ email: data.email });
            if (isEmailExists) {
                return res.json({ error: "Email is already exists" })
                // process.exit(0)

            }
            else {

                //encrypting the password
                const hashedPassword = await bcrypt.hash(data.password, 10)
                const createUser = await WebUser.create({ name: data.name, email: data.email, password: hashedPassword })
                return res.json({ success: "account created successfully" })
            }
        }
    }
    catch (e) {
        console.error("REGISTER ERROR:", e);
        return res.status(200).json({ internetError: "Internet connection failed" })
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


/* ============================= EMAIL OTP SEND & STORE IN REDIS CLOUD DB ==============================================*/
//Email Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_EXPIRY = 180; //180/60 = 3 minute
const ATTEMPT_LIMIT = 5;
const OTP_RESEND_COOLDOWN = 30; //30 second ke baad firse email send kar sakte hai nahi toh usse pahle nahi kar sakte hai

//Redis Connection
const redis = new Redis(process.env.REDIS_CLOUD_URL);
//checking redis connection
redis.on("connect", () => {
    console.log("Redis connected successfully");
})
redis.on("error", (error) => console.log("Failed to connect Redis: ", error))

//Function to make plain OTP into Hashed Format
function plainToHashed(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}


//otp via email and redis
Router.post('/auth/email', async (req, res) => {
    try {
        const { email } = req.body;
        if (email == "") {
            return res.json({ error: "email is required" })
        }
        const isEmailValid = (await validate(email.trim().toLowerCase())).valid;
        if (isEmailValid == false) {
            return res.json({ error: "Email is invalid" })
        }

        //Making email cleared
        const clearedEmail = email.trim().toLowerCase();
        const isEmailAlreadyExists = await WebUser.findOne({ email: clearedEmail })

        if (isEmailAlreadyExists) {
            return res.json({ error: "Email is already verified, so Please login." })
        }

        const isVerificationCooldownRunning = await redis.get(`otp:cooldown:${clearedEmail}`)

        if (isVerificationCooldownRunning) {
            const timeRemainForCooldown = await redis.ttl(`otp:cooldown:${clearedEmail}`)
            return res.json({ error: `Please wait ${timeRemainForCooldown} seconds before requesting another OTP` })
        }
        else {
            //sending email
            const otp = crypto.randomInt(100000, 1000000).toString()
            const hashedOTP = await plainToHashed(otp)

            //set hashed otp with expiry in redis
            await redis.set(`otp:${clearedEmail}`, hashedOTP, "EX", OTP_EXPIRY); //store otp in redis for 3 minute
            await redis.del(`otp:attempts:${clearedEmail}`) // reset the attempt as attempt limit is 5

            //sending email

            const { data, error } = await resend.emails.send({
                from: process.env.FROM_SENDER,
                to: [clearedEmail],
                subject: "Your Email Verification OTP",
                html: `
                <div style="
                    margin: 0;
                    padding: 48px 20px;
                    background-color: #f7f7f8;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                ">
                    <div style="
                    max-width: 480px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #e8e8eb;
                    border-radius: 14px;
                    overflow: hidden;
                    ">
    
                    <!-- Header -->
                    <div style="
                        padding: 32px 36px 24px;
                        border-bottom: 1px solid #f0f0f2;
                    ">
                        <div style="
                        width: 36px;
                        height: 36px;
                        line-height: 36px;
                        background-color: #111111;
                        color: #ffffff;
                        border-radius: 9px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 700;
                        margin-bottom: 28px;
                        ">RC</div>
    
                        <h1 style="
                        margin: 0;
                        color: #111111;
                        font-size: 22px;
                        line-height: 1.3;
                        font-weight: 600;
                        letter-spacing: -0.4px;
                        ">
                        Verify your email
                        </h1>
                    </div>
    
                    <!-- Content -->
                    <div style="
                        padding: 32px 36px 36px;
                    ">
    
                        <p style="
                        margin: 0;
                        color: #55555c;
                        font-size: 15px;
                        line-height: 1.7;
                        ">
                        Enter the verification code below to continue.
                        This code is valid for 3 minutes.
                        </p>
    
                        <!-- OTP -->
                        <div style="
                        margin: 28px 0;
                        padding: 22px 20px;
                        background-color: #fafafa;
                        border: 1px solid #e6e6e8;
                        border-radius: 10px;
                        text-align: center;
                        ">
                        <span style="
                            color: #111111;
                            font-size: 30px;
                            line-height: 1;
                            font-weight: 600;
                            letter-spacing: 9px;
                            padding-left: 9px;
                        ">
                            ${otp}
                        </span>
                        </div>
    
                        <p style="
                        margin: 0;
                        color: #8a8a91;
                        font-size: 13px;
                        line-height: 1.6;
                        ">
                        If you didn't request this code, you can safely ignore
                        this email.
                        </p>
    
                    </div>
    
                    <!-- Footer -->
                    <div style="
                        padding: 20px 36px;
                        background-color: #fafafa;
                        border-top: 1px solid #f0f0f2;
                    ">
                        <p style="
                        margin: 0;
                        color: #a0a0a6;
                        font-size: 11px;
                        line-height: 1.5;
                        ">
                        This is an automated message. Please do not reply.
                        </p>
                    </div>
    
                    </div>
                </div>
                `,

            });

            if (error) {
                await redis.del(`otp:${clearedEmail}`)
                await redis.del(`otp:cooldown:${clearedEmail}`)
                return res.json({ error: "Failed to send OTP to your email" });
            }
            else {
                //set cooldown to tell user that email is still cooling down so please wait 30 sec for another OTP request
                await redis.set(`otp:cooldown:${clearedEmail}`, "yes", 'EX', OTP_RESEND_COOLDOWN);
                console.log("Cooldown Email: ", await redis.ttl(`otp:cooldown:${clearedEmail}`))
                return res.json({ success: "OTP sent successfully to your email, Please verify it" })
            }


        }
    }
    catch (e) {
        console.error("Backend Failed in OTP verification")
    }
})


//Email Verification
Router.post('/auth/email/verify', async (req, res) => {
    try {
        const { userOtp, email } = req.body;
        if (!userOtp) {
            return res.json({ error: "OTP is required" })
        }
        else {
            const RedisStoredOtp = await redis.get(`otp:${email.trim().toLowerCase()}`)

            if (!RedisStoredOtp) {
                return res.json({ error: "OTP expired or not found" })
            }

            //check current attempts
            const currentAttempts = Number(await redis.get(`otp:attempts:${email.trim().toLowerCase()}`)) || 0;
            if (currentAttempts >= ATTEMPT_LIMIT) {
                await redis.del(`otp:${email.trim().toLowerCase()}`)
                await redis.del(`otp:attempts:${email.trim().toLowerCase()}`)
                return res.json({ error: "Too many incorrect attempts. Please request a new OTP." })
            }
            else {
                const hashedUserOtp = plainToHashed(userOtp);

                if (hashedUserOtp != RedisStoredOtp) {
                    const attempts = Number(await redis.get(`otp:attempts:${email.trim().toLowerCase()}`)) || 0
                    if (attempts >= ATTEMPT_LIMIT) {
                        return res.json({ error: "Too many incorrect attempts. Please request a new OTP." })
                    }
                    await redis.incr(`otp:attempts:${email.trim().toLowerCase()}`)
                    return res.json({ error: "Invalid OTP" })
                }
                else {
                    await redis.del(`otp:${email.trim().toLowerCase()}`)
                    await redis.del(`otp:attempts:${email.trim().toLowerCase()}`)
                    return res.json({ success: "Email Verified Successfully" })
                }
            }
        }
    }
    catch (e) {
        console.error("Failed in email verification at backend, ", e)
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