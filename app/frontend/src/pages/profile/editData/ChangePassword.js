import React, {useState} from "react";
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import {useTranslation} from "react-i18next";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const cookies = useCookies()[0]
    const {t} = useTranslation()
    const history = useHistory()


    async function submitHandler(e) {
        e.preventDefault()
        setError('')
        if (newPassword2 !== newPassword1) {
            setError('hasła muszą się zgadzać')
        }

        if (error) return

        setLoading(true)
        try {
            await axios.patch(
                '/api/users/change_pwd',
                {
                    new_pwd: newPassword1,
                    old_pwd: oldPassword
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
        <div className='card mt-4'>
            <h3 className='text-2xl'>{t('profile.change_pwd.header')}</h3>
            <form onSubmit={submitHandler}>
                {error && <div className='alert-danger'>{error}</div>}
                <div className="form-group">
                    <label htmlFor="oldPassword">{t('profile.change_pwd.oldPassword')}</label>
                    <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                           type="password" className="text-input" id="oldPassword"
                           placeholder={t('profile.change_pwd.oldPassword')}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword1">{t('profile.change_pwd.newPassword')}</label>
                    <input value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)}
                           type="password" className="text-input" id="newPassword1"
                           placeholder={t('profile.change_pwd.newPassword')}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword2">{t('profile.change_pwd.newPassword2')}</label>
                    <input value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)}
                           type="password" className="text-input" id="newPassword2"
                           placeholder={t('profile.change_pwd.newPassword2')}/>
                </div>
                <button className="btn btn-primary" disabled={!oldPassword || !newPassword2 || !newPassword1}
                        type='submit'>
                    {loading ? <div className="spinner"/> : t('profile.change_pwd.submit')}
                </button>
            </form>
        </div>
    )
}