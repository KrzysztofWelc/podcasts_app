import React, {useState} from "react";
import axios from "../utils/axios";
import {useCookies} from "react-cookie";
import {useHistory} from 'react-router-dom'
import {useAuth} from "../contexts/GlobalContext";
import {useTranslation} from "react-i18next";

export default function PublishPodcast() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('0')
    const [file, setFile] = useState()
    const [cover, setCover] = useState(null)
    const [errors, setErrors] = useState([])
    const cookies = useCookies()[0]
    const history = useHistory()
    const {currentUser} = useAuth()
    const {t} = useTranslation()

    function selectFileHandler(e) {
        setFile(e.target.files[0])
    }

    function selectCoverHandler(e) {
        setCover(e.target.files[0])
    }

    async function submitHandler(e) {
        e.preventDefault()
        let data = new FormData()

        data.append('audio_file', file)
        data.append('title', title)
        data.append('description', description)
        if(cover){
            data.append('cover_file', cover)
        }


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
            setUploading(false)
            if (!e.response) {
                setErrors(['server error'])
            } else {
                const err = e.response.data
                const errArray = []
                for (const key in err) {
                    err[key].forEach(msg => errArray.push(msg))
                }
                setErrors(errArray)
            }
        }
    }

    return (
        <div className="card mt-4">
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
            <h2 className='text-2xl'>{t('publish.header')}</h2>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="title">{t('publish.title')}</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                           type="text" className="text-input" id="title"
                           placeholder={t('publish.title')}/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">{t('publish.desc')}</label>
                    <input value={description} onChange={(e) => setDescription(e.target.value)}
                           type="text" className="text-input" id="description"
                           placeholder={t('publish.desc')}/>
                </div>

                <div className="custom-file mb-3">
                    <label className="custom-file-label" htmlFor="customFileLangHTML"
                           data-browse="select">{file ? file.name : t('publish.podcastFile')}</label>
                    <input onChange={selectFileHandler} type="file" className="file-input"
                           id="customFileLangHTML" accept='audio/mpeg'/>

                </div>
                <div className="custom-file mb-3">
                    <label className="custom-file-label" htmlFor="customCOVERLangHTML"
                    >{cover ? cover.name : t('publish.podcastCover')}</label>
                    <input onChange={selectCoverHandler} type="file" className="file-input"
                           id="customCOVERLangHTML" accept='image/jpeg, image/png'/>

                </div>
                <input disabled={!file || !title || !description } type="submit"
                       className='btn' value={t('publish.submit')}/>
            </form>
        </div>

    )
}