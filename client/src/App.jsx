import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import ContactUs from './ContactUs'
import Dashboard from './Dashboard'
import Logout from './Logout'
import PageNotFound from './PageNotFound'
import AdminDashboard from './AdminDashboard'
import AdminUser from './AdminUsers'
import AdminContactMessage from './AdminContactMessage'
import ContactMessages from './ContactMessages'
import NormalMessages from './NormalMessages'
import AdminLogin from './AdminLogin'
import Blogs from './Blogs/Blogs'
import WriteBlog from './Blogs/WriteBlog'
import ReadBlog from './Blogs/ReadBlog'
import AdminBlogs from './AdminBlogs'
import NoBlogFound from './Blogs/NoBlogFound'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/contactUs' element={<ContactUs />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/blogs' element={<Blogs/>}></Route>
          <Route path='/blogs/write_blog' element={<WriteBlog/>}></Route>
          <Route path='/blogs/read/:id' element={<ReadBlog/>}></Route>
          <Route path='/admin/blogs/edit/:id' element={<WriteBlog/>}></Route>
          <Route path='/blogs/filter/tags/:tag' element={<NoBlogFound/>}></Route>
          <Route path="/admin/login" element={<AdminLogin/>}></Route>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminUser />}></Route>
            <Route path='users' element={<AdminUser />}></Route>
            <Route path='blogs' element={<AdminBlogs />}></Route>
            <Route path='messages' element={<AdminContactMessage />}>
            <Route index element={<ContactMessages/>}></Route>
              <Route path='contact' element={<ContactMessages />}></Route>
              <Route path='normal' element={<NormalMessages />}></Route>
            </Route>
          </Route>
          <Route path='*' element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
