import React, {useState} from "react";
import {useHistory} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";
import {useTranslation} from "react-i18next";


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const {logIn} = useAuth()
    const history = useHistory()
    const {t} = useTranslation()

    async function handleSubmit(e) {
        e.preventDefault()

        setErrors([])

        const err = await logIn(
            email,
            password
        )

        if(err){
            console.log(err)
            const errArray = []
            for(const key in err){
                err[key].forEach(msg=> errArray.push(msg))
            }
            setErrors(errArray)
        }else{
            history.push('/')
        }
    }

    return (
        <div className="card mt-4">
                {errors.length > 0 && errors.map(err => <div className='alert-danger mb-3' key={err.slice(2,7)+Math.random()}>{err}</div>)}
                <h2 className='text-2xl'>{t('login.header')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">{t('login.email')}</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                               type="email" className="text-input" id="email"
                               placeholder={t('login.email')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('login.password')}</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                               type="password" className="text-input" id="password"
                               placeholder={t('login.password')}/>
                    </div>
                    <input type="submit" className='btn' value={t('login.submit')}/>
                </form>
        </div>

    )
}