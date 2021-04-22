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
                    auth_token: `Bearer: ${cookies.authToken}`
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
        setUploading(false)
    }

    return (
        <div className="card">
            {uploading && <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(153, 204, 255, 0.5)',
                    zIndex: 1000,
                    top: 0,
                    left: 0
                }}
                className='position-fixed d-flex align-items-center justify-content-center'
            >
                <div className="progress" style={{width: '80%', height: '30px'}}>
                    <div className="progress-bar" role="progressbar" style={{width: progress + '%'}}
                         aria-valuenow={progress}
                         aria-valuemin="0" aria-valuemax="100"/>
                </div>
            </div>}
            <div className="card-body">
                {errors.length !== 0 && errors.map(msg => <div className='alert alert-danger'
                                                               key={Math.random()}>{msg}</div>)}
                <h2>Publish podcast</h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)}
                               type="text" className="form-control" id="title"
                               placeholder="title"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Title</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)}
                               type="text" className="form-control" id="description"
                               placeholder="description"/>
                    </div>

                    <div className="custom-file mb-3">
                        <input onChange={selectFileHandler} type="file" className="custom-file-input"
                               id="customFileLangHTML" accept='audio/mpeg'/>
                        <label className="custom-file-label" htmlFor="customFileLangHTML"
                               data-browse="select">{file ? file.name : 'choose podcast file'}</label>
                    </div>
                    <div className="custom-file mb-3">
                        <input onChange={selectCoverHandler} type="file" className="custom-file-input"
                               id="customCOVERLangHTML" accept='image/jpeg, image/png'/>
                        <label className="custom-file-label" htmlFor="customCOVERLangHTML"
                               data-browse="select">{cover ? cover.name : 'choose cover file'}</label>
                    </div>
                    <input disabled={!file || !title || !description || !cover} type="submit"
                           className='btn btn-primary' value="Prześlij"/>
                </form>
            </div>
        </div>

    )
}