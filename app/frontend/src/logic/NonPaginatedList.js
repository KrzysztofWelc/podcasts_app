import React, {useState, useEffect} from "react";
import axios from "../utils/axios";
export default function NonPaginatedList({render, url}) {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function fetchUsers() {
            const {data} = await axios.get(url)
            setItems(data.items)
            setLoading(false)
        }

        fetchUsers()
    }, [url])

    return render({items, loading})
}