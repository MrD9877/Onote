import React from 'react'
import Footer from './Footer.js'
import Navbar from './Navbar.js'
import { useState, useEffect } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Contact from './Contact.js';
import EditNotes from './EditNote.js';
import NotesTable from './NotesTable.js';
import Home from './Home.js';
import { useNavigate } from 'react-router-dom';
import ViewNotesPage from './ViewNotesPage.js';


function Auth() {
    const [userNotes, setUsernotes] = useState(null)
    const [content, setContent] = useState()
    const [topic, setTopic] = useState()

    const navigate = useNavigate()
    const navigateTOlogin = (url, delay) => {
        setTimeout(() => {
            navigate(url)
        }, delay)
    }

    const deleteFech = async (index) => {
        const deleteId = userNotes[index]._id
        try {
            await fetch(`http://localhost:3000/usernotes`, {
                method: "DELETE", credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: deleteId })
            })
        } catch {
            console.log("nonono")
        }
    }

    const viewNote = (index) => {
        setTopic(() => {
            const topic = userNotes[index].topic
            return topic
        })
        setContent(() => {
            const content = userNotes[index].content
            return content
        })
    }

    const deleteNote = async (index) => {
        await deleteFech(index)
        fechUserNotes()
    }


    const fechUserNotes = async () => {
        try {
            const data = await fetch(`${process.env.API_KEY}/usernotes`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const notes = await data.json()
            setUsernotes(notes)
        } catch {
            console.log("fail to get notes from server")
        }
    }
    useEffect(() => {
        fechUserNotes()
    }, [])

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='home' element={<Home />} />
                <Route path='mynotes' element={<NotesTable viewNote={viewNote} deleteNote={deleteNote} userNotes={userNotes} />} />
                <Route path='viewnotes' element={<ViewNotesPage topic={topic} content={content} />} />
                <Route path='editnotes' element={<EditNotes fechUserNotes={fechUserNotes} userNotes={userNotes} />} />
                <Route path='contact' element={<Contact />} />
            </Routes>
            <Footer />
        </>
    )
}

export default Auth
