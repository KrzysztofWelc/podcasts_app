import React, {useState} from "react";
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'

export default function ChangeAvatar() {
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const cookies = useCookies()[0]
    const history = useHistory()

    function selectFileHandler(e) {
        const _file = e.target.files[0]
        setFile(_file)
    }


    async function submitHandler(e) {
        e.preventDefault()
        setLoading(true)
        const data = new FormData()
        data.append('new_profile_pic', file)
        try {
            await axios.patch(
                '/api/users/change_profile_pic',
                data,
                {
                    headers: {
                        "Content-Type": 'multipart/form-data',
                        authToken: `Bearer: ${cookies.authToken}`
                    },
                }
            )
            history.push('/')
        } catch (e) {
            setLoading(false)
            if (e.status === 500) {
                setError('Coś poszło nie tak.')
            } else {
                const err = e.response.data.error

                setError(err)
            }
        }
    }

    return (
        <form onSubmit={submitHandler}>
            {error && <div className='alert alert-danger'>{error}</div>}
            <div className="custom-file mb-3">
                <input onChange={selectFileHandler} type="file" className="custom-file-input"
                       id="customFileLangHTML" accept='image/jpeg, image/png'/>
                <label className="custom-file-label" htmlFor="customFileLangHTML"
                       data-browse="select">{file ? file.name : 'choose podcast file'}</label>
            </div>
            <button className="btn btn-primary" disabled={!file || loading} type='submit'>
                {loading ? (<>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        <span className="sr-only">Loading...</span></>
                    ) : 'prześlij'}
            </button>
        </form>
    )
}