import React, {useState} from 'react'
import axios from "../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'

export default function DeleteForm({podcast, cancelHAndler}) {
    const [errors, setErrors] = useState([])
    const cookies = useCookies()[0]
    const history = useHistory()


    async function handleDelete(e) {
        e.preventDefault()
        e.stopPropagation()

        setErrors([])

        try {
            const {data} = await axios.delete(
                `/api/podcasts/${podcast.id}`,
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
        <div className="card mt-4 bg-white">
            {errors.length > 0 && errors.map(err => <div className='alert-danger mb-3'
                                                         key={err.slice(2, 7) + Math.random()}>{err}</div>)}
            <h2 className='text-2xl'>Delete Podcast</h2>
            <p>Are you sure?</p>
            <form className='flex align-center justify-around mt-6'>
                <button onClick={(e)=>{
                    e.preventDefault()
                    cancelHAndler()
                }}
                className='btn'>No</button>
                <button className='btn-danger' onClick={handleDelete} type="submit">Yes</button>
            </form>
        </div>
    )
}