import React, {useState} from 'react'
import {Link} from 'react-router-dom'

export default function Answer({data}){
    return (
        <li className='mb-4 p-2 border-b'>
            <div>
                <Link className='mr-2 hover:text-blue-400 cursor-pointer' to={`/user/`}>{data.author.username}</Link>
                <small>{data.created_at}</small>
            </div>
            <p className='ml-2'>
               {data.text}
            </p>
        </li>
    )
}