import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import Comment from './../Comment/Comment';
import CreateComment from '../CreateComment/CreateComment';

export default function AllComments() {

    let { id } = useParams()

    function getAllComments() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data } = useQuery({
        queryKey: ["allComments"],
        queryFn: getAllComments,
        select: (res) => res?.data.data.comments
    })
    // console.log(data);


    return <div className='min-h-screen max-w-lg mx-auto'>
        {/* comment input */}
        <CreateComment id={id} />
        {data?.map((comment) => {
            return <Comment key={comment._id} comment={comment} id={id} />
        })}
    </div>
}
