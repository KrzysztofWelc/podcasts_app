import React, {useState} from 'react'
import axios from "../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'

export default function EditPodcastForm({podcast}) {
    const [errors, setErrors] = useState([])
    const [title, setTitle] = useState(podcast.title)
    const [description, setDescription] = useState(podcast.description)
    const cookies = useCookies()[0]
    const history = useHistory()


    async function handleSubmit(e) {
        e.preventDefault()

        setErrors([])

        try {
            const {data} = await axios.patch(
                `/api/podcasts/${podcast.id}`,
                {
                    title,
                    description
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authToken: `Bearer: ${cookies.authToken}`
                    },
                }
            )
            history.push('/')
        } catch (err) {
            console.log(err)
            const errArray = []
            for (const key in err) {
                err[key].forEach(msg => errArray.push(msg))
            }
            setErrors(errArray)
        }
    }

    return (
        <div onClick={e=>e.stopPropagation()} className="card mt-4 bg-white">
            {errors.length > 0 && errors.map(err => <div className='alert-danger mb-3'
                                                         key={err.slice(2, 7) + Math.random()}>{err}</div>)}
            <h2 className='text-2xl'>Edit Podcast</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                           type="text" className="text-input" id="title"
                           placeholder="title"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                              className="text-input" id="description"
                              placeholder="description"/>
                </div>
                <input type="submit" className='btn' value="Save"/>
            </form>
        </div>
    )
}