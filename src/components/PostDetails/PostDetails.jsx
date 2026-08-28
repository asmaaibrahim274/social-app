import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import Comment from './../Comment/Comment';
import CreateComment from '../CreateComment/CreateComment';
import { TimeContext } from '../context/TimeContext';
import { UserData } from '../context/UserData';
import PostDropDown from '../PostDropDown/PostDropDown';

export default function PostDetails() {

    let { id } = useParams();
    let query = useQueryClient();
    let { data: userData } = useContext(UserData);

    //!!!!!!!!!!!!!!!! Like & Unlike Post !!!!!!!!!!!!!!!!
    function likePost() {
        return axios.put(`https://route-posts.routemisr.com/posts/${id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: likeData, mutate: likeFn } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["postDetails"] });
            // toast.success("liked");
        }
    })



    let { getHoursAgo } = useContext(TimeContext);


    console.log(id);


    function getAllComments() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: comments } = useQuery({
        queryKey: ["allComments"],
        queryFn: getAllComments,
        select: (res) => res?.data.data.comments
    })


    function getPostDetails() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data } = useQuery({
        queryKey: ["postDetails"],
        queryFn: getPostDetails,
        select: ((res) => res.data.data.post)
    })

    // console.log(data);

    return <div className='min-h-screen'>
        <div className="bg-white p-4 rounded shadow max-w-1/2 mx-auto my-4">
            <header className="flex items-center space-x-3 mb-3">
                <div className="flex items-center space-x-3 mb-3">
                    <img src={data?.user.photo} alt="User" className="h-10 w-10 rounded-full" />
                    <div>
                        <p className="font-semibold">{data?.user.name}</p>
                        <p className="text-xs text-gray-500">{getHoursAgo(data?.createdAt)}</p>
                    </div>
                </div>
                <div>
                    {data?.user._id === userData?.id && <PostDropDown id={data?.id} />}
                </div>
            </header>
            {data?.body && <p className="mb-3">{data?.body}</p>}
            {data?.image && <img src={data?.image} alt="Beach" className="rounded max-h-96 w-full object-cover mb-3" />}
            <div className="flex justify-between text-gray-600 text-sm font-semibold">
                <button onClick={likeFn} className={`flex items-center space-x-1 hover:text-blue-600 cursor-pointer ${likeData?.data.data.liked ? `text-blue-600` : ""}`}>
                    <i className="fas fa-thumbs-up" /><span>{data?.likesCount} Like</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-600">
                    <i className="fas fa-comment" /><span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-600">
                    <i className="fas fa-share" /><span>Share</span>
                </button>
            </div>
            {/* comment input */}
            <CreateComment id={id} />
            {/* display all comments */}
            {comments?.map((comment) => {
                return <Comment key={comment._id} comment={comment} id={id} />
            })}
        </div>
    </div>
}
