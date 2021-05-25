import React, {useState} from "react";
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import {useTranslation} from "react-i18next";

export default function ChangeAvatar() {
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const cookies = useCookies()[0]
    const history = useHistory()
    const {t} = useTranslation()

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
                setError(t('error.general'))
            } else {
                const err = e.response.data.error

                setError(err)
            }
        }
    }

    return (
        <div className='card mt-4'>
            <h3 className='text-2xl'>{t('profile.changeAvatar.header')}</h3>
            <form onSubmit={submitHandler}>
                {error && <div className='alert-danger'>{error}</div>}
                <div className="custom-file mb-3">
                    <label className="custom-file-label" htmlFor="customFileLangHTML"
                           data-browse="select">{file ? file.name : t('profile.changeAvatar.label')}</label>
                    <input onChange={selectFileHandler} type="file" className="file-input"
                           id="customFileLangHTML" accept='image/jpeg, image/png'/>

                </div>
                <button className="btn" disabled={!file || loading} type='submit'>
                    {loading ? <div className="spinner"/> : t('profile.changeAvatar.submit')}
                </button>
            </form>
        </div>

    )
}