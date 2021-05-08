import React, {useState} from "react";
import {useHistory} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const {logIn} = useAuth()
    const history = useHistory()

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
                <h2 className='text-2xl'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                               type="email" className="text-input" id="email"
                               placeholder="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                               type="password" className="text-input" id="password"
                               placeholder="password"/>
                    </div>
                    <input type="submit" className='btn' value="Login"/>
                </form>
        </div>

    )
}