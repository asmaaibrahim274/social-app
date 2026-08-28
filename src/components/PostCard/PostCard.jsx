import React, { useContext } from 'react'
import Comment from '../Comment/Comment';
import { Link } from 'react-router-dom';
import CreateComment from '../CreateComment/CreateComment';
import { TimeContext } from '../context/TimeContext';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserData } from '../context/UserData';
import PostDropDown from '../PostDropDown/PostDropDown';

export default function PostCard({ post }) {
    // console.log(post); 

    let { data: userData } = useContext(UserData);

    let query = useQueryClient();

    //!!!!!!!!!!!!!!!! Like & Unlike Post !!!!!!!!!!!!!!!!
    function likePost() {
        return axios.put(`https://route-posts.routemisr.com/posts/${post.id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: likeData, mutate: likeFn } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["userPosts"] });
            // toast.success("liked");
        }
    })

    // console.log(likeData?.data.data.liked);

    //!!!!!!!!!!!!!!!! Handle Post Time Fn !!!!!!!!!!!!!!!!
    let { getHoursAgo } = useContext(TimeContext);


    return <>
        <div className="bg-white p-4 rounded shadow max-w-1/2 mx-auto my-4">

            <header className="flex justify-between items-center space-x-3 mb-3">
                <Link to={`postDetails/${post.id}`}>
                    <div className="flex items-center space-x-3 mb-3">
                        <img src={post.user.photo} alt="User" className="h-10 w-10 rounded-full" />
                        <div>
                            <p className="font-semibold">{post.user.name}</p>
                            <p className="text-xs text-gray-500">{getHoursAgo(post.createdAt)}</p>
                        </div>
                    </div>
                </Link>
                <div>
                    {post?.user._id === userData?.id && <PostDropDown id={post.id} />}
                </div>
            </header>


            {post.body && <p className="mb-3">{post.body}</p>}
            {post.image && <img src={post.image} alt="Beach" className="rounded max-h-96 w-full object-cover mb-3" />}
            <div className="flex justify-between text-gray-600 text-sm font-semibold">
                <button onClick={likeFn} className={`flex items-center space-x-1 hover:text-blue-600 cursor-pointer ${likeData?.data.data.liked ? `text-blue-600` : ""}`}>
                    <i className="fas fa-thumbs-up" /><span>{post.likesCount} Like</span>
                </button>
                <Link to={`allcomments/${post.id}`}>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                        <i className="fas fa-comment" /><span>Comment</span>
                    </button>
                </Link>
                <button className="flex items-center space-x-1 hover:text-blue-600">
                    <i className="fas fa-share" /><span>Share</span>
                </button>
            </div>
            {/* comment input */}
            <CreateComment id={post.id} />
            {/* Top Comment */}
            {post.topComment && <Comment comment={post.topComment} id={post.id} />}
        </div >
    </>
}
