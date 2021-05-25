import React, {useState} from "react";
import {useHistory, Link} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";
import {useTranslation} from "react-i18next";


export default function Register() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [policyAccepted, setPolicyAccepted] = useState(false)
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState([])
    const {signUp} = useAuth()
    const history = useHistory()
    const {t} = useTranslation()

    function selectFileHandler(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setErrors([])

        if(!password || !email || !username || !password2){
            return setErrors([...errors, t('error.allInputsRequired')])
        }

        if (password2 !== password) {
            return setErrors([...errors, t('error.matchPasswords')])
        }

        if (!policyAccepted){
            return setErrors([...errors, t('error.acceptPolicy')])
        }


        const err = await signUp(
            username,
            email,
            password,
            password2,
            file
        )

        if (err) {
            console.log(err)
            const errArray = []
            for (const key in err) {
                err[key].forEach(msg => errArray.push(msg))
            }
            setErrors(errArray)

        } else {
            history.push('/')
        }
    }

    return (
        <div className="card mt-4">
            {errors.length > 0 && errors.map(err => <div className='alert-danger mb-4'
                                                         key={err.slice(2, 7) + Math.random()}>{err}</div>)}
            <h2 className='text-2xl'>{t('register.header')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">{t('register.email')}</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                           type="email"
                           className="text-input"
                           id="email"
                           placeholder={t('register.email')}/>
                </div>
                <div className="form-group">
                    <label htmlFor="username">{t('register.username')}</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)}
                           type="text"
                           className="text-input"
                           id="username"
                           placeholder={t('register.username')}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t('register.password')}</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)}
                           type="password"
                           className="text-input"
                           id="password"
                           placeholder={t('register.password')}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password2">{t('register.password2')}</label>
                    <input value={password2} onChange={(e) => setPassword2(e.target.value)}
                           type="password" className="text-input" id="password2"
                           placeholder={t('register.password2')}/>
                </div>
                <div className="mb-3">
                    <label className="file-input-label"
                           htmlFor="customFileLangHTML">{file ? file.name : t('register.avatar')}</label>
                    <input onChange={selectFileHandler} type="file"
                           className="file-input"
                           id="customFileLangHTML" accept='image/jpeg, image/png'/>

                </div>
                <div className="form-group">
                    <label className="inline-flex items-center mt-3">
                        <input checked={policyAccepted} onChange={(e)=>setPolicyAccepted(e.target.checked)} type="checkbox" className="form-checkbox h-5 w-5 text-purple-900"/>
                        <span className="ml-2 text-gray-700">{t('acceptPolicy.accept')} <Link
                            className='hover:text-purple-900'
                            to='/policy'>{t('acceptPolicy.policy')}</Link></span>
                    </label>
                </div>
                <input type="submit" className='btn' value={t('register.submit')}/>
            </form>
        </div>

    )
}