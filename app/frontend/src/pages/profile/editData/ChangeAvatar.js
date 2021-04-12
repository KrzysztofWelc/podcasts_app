import React, {useState} from "react";
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";

export default function ChangeAvatar() {
    const [file, setFile] = useState(null)
    const [fileSRC, setFileSRC] = useState(null)
    const [error, setError] = useState('')
    const cookies = useCookies()[0]

    function selectFileHandler(e) {
        const _file=e.target.files[0]
        setFile(_file)
    }


    async function submitHandler(e) {
        e.preventDefault()
        const data = new FormData()
        data.append('new_profile_pic', file)
        try {
            await axios.patch(
                '/api/users/change_profile_pic',
                data,
                {
                    headers: {
                        "Content-Type": 'multipart/form-data',
                        auth_token: `Bearer: ${cookies.authToken}`
                    },
                }
            )
        } catch (e) {
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
            <input disabled={!file} type="submit" className='btn btn-primary' value="Register"/>
        </form>
    )
}