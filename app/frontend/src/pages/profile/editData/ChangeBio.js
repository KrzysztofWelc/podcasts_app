import React, {useState} from "react";
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import {useTranslation} from "react-i18next";


export default function ChangeBio() {
    const [bio, setBio] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const cookies = useCookies()[0]
    const history = useHistory()
    const {t} = useTranslation()

    async function submitHandler(e) {
        e.preventDefault()
        setError('')

        if (bio.length > 500) {
            setError('biogram może mieć maksymalnie 500 znaków')
        }

        if (error) return

        setLoading(true)
        try {
            await axios.patch(
                '/api/users/edit_bio',
                {
                    bio
                },
                {
                    headers: {
                        "Content-Type": "application/json",
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
        <div className='card'>
            <h3 className='text-2xl'>{t('profile.changeBio.header')}</h3>
            <form onSubmit={submitHandler}>
                {error && <div className='alert-danger'>{error}</div>}
                <div className="form-group">
                    <label htmlFor="bio">{t('profile.changeBio.label')}</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                           className="text-input" id="bio"
                           placeholder={t('profile.changeBio.label')}/>
                </div>
                <button className="btn btn-primary" disabled={!bio}
                        type='submit'>
                    {loading ? <div className="spinner"/> : t('profile.changeBio.submit')}
                </button>
            </form>
        </div>
    )
}