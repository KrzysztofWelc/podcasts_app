import React, {useState} from "react";
import {useHistory} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";


export default function Register() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState([])
    const {signUp} = useAuth()
    const history = useHistory()

    function selectFileHandler(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setErrors([])

        if (password2 !== password) {
            return setErrors([...errors, 'Passwords must match.'])
        }


        const err = await signUp(
            username,
            email,
            password,
            password2,
            file
        )

        if(err){
            console.log(err)
            const errArray = []
            for(const key in err){
                err[key].forEach(msg=> errArray.push(`${key}: ${msg}`))
            }
            setErrors(errArray)
        }else{
            history.push('/')
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                {errors.length > 0 && errors.map(err => <p key={err.slice(2,7)+Math.random()}>{err}</p>)}
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                               type="email" className="form-control" id="email"
                               placeholder="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)}
                               type="text" className="form-control" id="username"
                               placeholder="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                               type="password" className="form-control" id="password"
                               placeholder="password"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Repeat Password</label>
                        <input value={password2} onChange={(e) => setPassword2(e.target.value)}
                               type="password" className="form-control" id="password2"
                               placeholder="password2"/>
                    </div>
                    <div className="custom-file mb-3">
                        <input onChange={selectFileHandler} type="file" className="custom-file-input"
                               id="customFileLangHTML" accept='image/jpeg, image/png'/>
                        <label className="custom-file-label" htmlFor="customFileLangHTML"
                               data-browse="select">{file ? file.name : 'choose podcast file'}</label>
                    </div>
                    <input type="submit" className='btn btn-primary' value="Register"/>
                </form>
            </div>
        </div>

    )
}