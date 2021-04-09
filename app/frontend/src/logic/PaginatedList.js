import React, {useState, useEffect} from "react";
import axios from "../utils/axios";
export default function PaginatedList({render, url}) {

    const [items, setItems] = useState([])
    const [page, setPage] = useState(1)
    const [isMore, setIsMore] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function fetchUsers() {
            const {data} = await axios.get(url + '1')
            setItems(data.items)
            setIsMore(data.is_more)
            setLoading(false)
        }

        fetchUsers()
    }, [url])

    useEffect(() => {
        async function fetchUsers() {
            const {data} = await axios.get(url + page)
            setItems(items.concat(data.items))
            setIsMore(data.is_more)
            setLoading(false)
        }

        fetchUsers()
    }, [page])

    function moreHandler(e) {
        e.preventDefault()
        setLoading(true)
        setPage(page + 1)
    }

    return render({items, isMore, loading, moreHandler})
}