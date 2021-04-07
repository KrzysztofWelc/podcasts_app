import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom'
import axios from "../utils/axios";

export default function SearchInput() {
    const [query, setQuery] = useState('')
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)
    const [previewLists, setPreviewLists] = useState({users: [], podcasts: []})
    const history = useHistory()

    //todo: debounce api call
    useEffect(() => {
        async function getResults(){
            if (query) {
                const {data} = await axios.get(`/api/search/preview/${query}`)
                setPreviewLists(data)
            } else {
                setPreviewLists({users: [], podcasts: []})
            }
        }
        getResults()
    }, [query])

    function submitHandler(e){
        e.preventDefault()
        history.push('/search/'+query)
    }

    return (
        <form onSubmit={submitHandler} style={{position: "relative"}} className="form-inline my-2 my-lg-0">
            <input value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onFocus={()=>setIsPreviewVisible(true)}
                   onBlur={()=>setIsPreviewVisible(false)}
                   className="form-control mr-sm-2"
                   type="search"
                   placeholder="Search"
                   aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            {((previewLists.users.length || previewLists.podcasts.length) && isPreviewVisible) ? (
                <div className='bg-primary p-1' style={{position: 'absolute', top: '2.5rem', width: '100%'}}>
                    {previewLists.podcasts.length ? (
                        <div>
                            <h4>podcasts</h4>
                            <ul className="list-group">
                                {previewLists.podcasts.length ? previewLists.podcasts.map(podcast => (
                                    <a key={podcast.id + 'podcast'} href='#'>
                                        <li className="list-group-item">{podcast.title}</li>
                                    </a>)) : null}
                            </ul>
                        </div>) : null}


                    {previewLists.users.length ? (
                        <div>
                            <h4>users</h4>
                            <ul className="list-group">
                                {previewLists.users.length ? previewLists.users.map(user => (
                                    <a key={user.id + 'user'} href='#'>
                                        <li className="list-group-item">{user.username}</li>
                                    </a>)) : null}
                            </ul>
                        </div>) : null}
                </div>
            ) : null}

        </form>
    )
}