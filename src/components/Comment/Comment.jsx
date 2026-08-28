import React, { useContext } from 'react'
import { TimeContext } from '../context/TimeContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CommentDropDown from '../commentDropDown/commentDropDown';
import { UserData } from '../context/UserData';

export default function Comment({ comment, id }) {
    // console.log(comment); // commentCreator { name , photo} content createdAt likes[].length 

    // console.log(comment);

    let { getHoursAgo } = useContext(TimeContext);
    let { data: userData } = useContext(UserData);
    let query = useQueryClient();

    //!!!!!!!!!!!!!!!! Comment & Unlike Post !!!!!!!!!!!!!!!!
    function likecomment() {
        return axios.put(`https://route-posts.routemisr.com/posts/${id}/comments/${comment._id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: likeCommentData, mutate: likeCommentFn } = useMutation({
        mutationFn: likecomment,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["allComments"] });
            // toast.success("liked");
        }
    })

    return <>
        <div className=" mx-auto border border-gray-300 px-6 py-4 rounded-lg mt-3">
            <div className='flex justify-between'>
                <div className="flex items-center mb-6">
                    <img src={comment?.commentCreator?.photo} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <div className="text-lg font-medium text-gray-800">{comment?.commentCreator?.name}</div>
                        <div className="text-gray-500">{getHoursAgo(comment?.createdAt)}</div>
                    </div>
                </div>
                <div>
                    {comment?.commentCreator?._id === userData.id && <CommentDropDown commentId={comment._id} postId={id} />}
                </div>
            </div>
            <p className="text-lg leading-relaxed mb-6">{comment?.content}</p>
            <div>
                <button onClick={likeCommentFn} type='button' className={`me-4 hover:text-blue-600 cursor-pointer ${likeCommentData?.data.data.liked ? `text-blue-600` : ""}`}><i className="far fa-thumbs-up" />{comment?.likes.length} Like
                </button>
                {/* <button onClick={likeFn} className={`flex items-center space-x-1 hover:text-blue-600 cursor-pointer ${likeCommentData?.data.data.liked ? `text-blue-600` : ""}`}>
                    <i className="fas fa-thumbs-up" /><span>{post.likesCount} Like</span>
                </button> */}
                <a href="" className="me-4 hover:text-blue-600 cursor-pointer"><i className="far fa-comment-alt" /> Reply</a>
            </div>
        </div>

    </>
}
