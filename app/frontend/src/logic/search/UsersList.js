import React, {useState, useEffect} from "react";
import axios from "../../utils/axios";

export default function UsersList({query}) {

    const [users, setUsers] = useState([])
    const [usersPage, setUsersPage] = useState(1)
    const [isMoreUsers, setIsMoreUsers] = useState(false)
    const [usersLoading, setUsersLoading] = useState(true)


    useEffect(() => {
        async function fetchUsers() {
            const {data} = await axios.get(`/api/search/users/${query}/1`)
            setUsers(data.users)
            setIsMoreUsers(data.is_more)
            setUsersLoading(false)
        }

        fetchUsers()
    }, [query])

    useEffect(() => {
        async function fetchUsers() {
            const {data} = await axios.get(`/api/search/users/${query}/${usersPage}`)
            setUsers(users.concat(data.users))
            setIsMoreUsers(data.is_more)
            setUsersLoading(false)
        }

        fetchUsers()
    }, [usersPage])

    function morePodcastsHandler(e) {
        e.preventDefault()
        setUsersLoading(true)
        setUsersPage(usersPage + 1)
    }

    return (
        users.length ? <div
            className='d-flex' style={{
            overflowX: 'auto'
        }}>

            {users.map(user => <div key={user.id}>{user.username}</div>)}
            {isMoreUsers && <button onClick={morePodcastsHandler}>more</button>}
            {usersLoading && <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>}
        </div> : null
    )
}