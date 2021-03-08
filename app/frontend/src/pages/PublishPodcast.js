import React, {useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'

export default function PublishPodcast() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('0')
    const [file, setFile] = useState()
    const [errors, setErrors] = useState([])
    const cookies = useCookies()[0]
    const history = useHistory()

    function selectFileHandler(e) {
        setFile(e.target.files[0])
    }

    async function submitHandler() {
        let data = new FormData()

        data.append('audio_file', file)
        data.append('title', title)
        data.append('description', description)

        setUploading(true)

        try {
            await axios.post('/podcasts', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    auth_token: `Bearer: ${cookies.authToken}`
                },
                onUploadProgress: (event) => {
                    setProgress(Math.round((100 * event.loaded) / event.total).toString(10));
                }
            })
            history.push('/')
        } catch (e) {
            if (e.status === 500) {
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
                {errors.length !== 0 && errors.map(msg => <p>{msg}</p>)}
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
                               id="customFileLangHTML"/>
                        <label className="custom-file-label" htmlFor="customFileLangHTML"
                               data-browse="select">{file ? file.name : 'choose podcast file'}</label>
                    </div>
                    <input disabled={!file || !title || !description} type="submit" className='btn btn-primary' value="Login"/>
                </form>
            </div>
        </div>

    )
}