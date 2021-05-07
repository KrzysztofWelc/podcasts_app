import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useAuth} from "../../../contexts/GlobalContext";
import axios from "../../../utils/axios";

export default function Answer({data}) {
    const {currentUser} = useAuth()
    const cookies = useCookies()[0]
    const [editText, setEditText] = useState(data.text)
    const [isEditMode, setEditMode] = useState(false)

    async function deleteHandler() {
        const {data} = await axios.delete(
            `/api/comments/answer/${data.id}`,
            {
                headers: {
                    authToken: `Bearer: ${cookies.authToken}`
                }
            }
        )
    }

    function editSubmitHandler() {
        console.log(2)
    }

    return (
        <li className='mb-4 p-2 border-b flex justify-between'>
            <div className='flex-grow'>
                <div>
                    <Link className='mr-2 hover:text-blue-400 cursor-pointer'
                          to={`/user/`}>{data.author.username}</Link>
                    <small>{data.created_at}</small>
                </div>
                {!isEditMode
                    ? (
                        <p className='ml-2'>
                            {data.text}
                        </p>
                    ) : (
                        <form onSubmit={editSubmitHandler} className='w-11/12'>
                        <textarea
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            value={editText} onChange={(e) => setEditText(e.target.value)}/>
                            <div>
                                <button type="submit" className="btn">save</button>
                            </div>

                        </form>
                    )}
            </div>
            <div className={'flex'}>
                {currentUser && currentUser.id == data.author.id && <>
                    <button onClick={() => setEditMode(!isEditMode)} className="btn mr-3">
                        <img className='h-6' src={`${process.env.BASE_URL}assets/edit.svg`} alt="edit icon"/>
                    </button>
                    <button onClick={deleteHandler} className="btn btn-danger">
                        <img className='h-6' src={`${process.env.BASE_URL}assets/delete.svg`} alt="edit icon"/>
                    </button>
                </>}
            </div>
        </li>
    )
}