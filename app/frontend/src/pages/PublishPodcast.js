import React, {useState} from "react";
import axios from "../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";

//TODO: inspect the problem causing podcasts to be sometimes not uploaded

export default function PublishPodcast() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('0')
    const [file, setFile] = useState()
    const [cover, setCover] = useState()
    const [errors, setErrors] = useState([])
    const cookies = useCookies()[0]
    const history = useHistory()
    const {currentUser} = useAuth()

    function selectFileHandler(e) {
        setFile(e.target.files[0])
    }

    function selectCoverHandler(e) {
        setCover(e.target.files[0])
    }

    async function submitHandler() {
        let data = new FormData()

        data.append('audio_file', file)
        data.append('title', title)
        data.append('description', description)
        data.append('cover_file', cover)

        setUploading(true)

        try {
            await axios.post('/api/podcasts', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authToken: `Bearer: ${cookies.authToken}`
                },
                onUploadProgress: (event) => {
                    setProgress(Math.round((100 * event.loaded) / event.total).toString(10));
                }
            })
            history.push('/user/' + currentUser.id)
        } catch (e) {
            if (!e.response) {
                setErrors(['server error'])
            } else {
                const err = e.response.data
                const errArray = []
                for (const key in err) {
                    err[key].forEach(msg => errArray.push(`${key}: ${msg}`))
                }
                setErrors(errArray)
            }
        }
    }

    return (
        <div className="card">
            {uploading && <div
                className='fixed flex items-center justify-center w-screen h-screen z-50 top-0 left-0 bg-green-500 bg-opacity-50'
            >
                <div className="progress" style={{width: '80%', height: '30px'}}>
                    <div className="progress-bar" role="progressbar" style={{width: progress + '%'}}
                         aria-valuenow={progress}
                         aria-valuemin="0" aria-valuemax="100"/>
                </div>
            </div>}
            {errors.length !== 0 && errors.map(msg => <div className='alert-danger'
                                                           key={Math.random()}>{msg}</div>)}
            <h2 className='text-2xl'>Publish podcast</h2>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                           type="text" className="text-input" id="title"
                           placeholder="title"/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Title</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)}
                           type="text" className="text-input" id="description"
                           placeholder="description"/>
                </div>

                <div className="custom-file mb-3">
                    <label className="custom-file-label" htmlFor="customFileLangHTML"
                           data-browse="select">{file ? file.name : 'choose podcast file'}</label>
                    <input onChange={selectFileHandler} type="file" className="file-input"
                           id="customFileLangHTML" accept='audio/mpeg'/>

                </div>
                <div className="custom-file mb-3">
                    <label className="custom-file-label" htmlFor="customCOVERLangHTML"
                    >{cover ? cover.name : 'choose cover file'}</label>
                    <input onChange={selectCoverHandler} type="file" className="file-input"
                           id="customCOVERLangHTML" accept='image/jpeg, image/png'/>

                </div>
                <input disabled={!file || !title || !description || !cover} type="submit"
                       className='btn' value="Prześlij"/>
            </form>
        </div>

    )
}