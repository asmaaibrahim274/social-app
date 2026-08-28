import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';

export default function CreateComment({ id }) {

    let query = useQueryClient();

    let formdata = new FormData();

    let { register, handleSubmit } = useForm({
        defaultValues: {
            content: '',
            image: ""
        }
    })

    function addComment() {
        return axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`, formdata, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, error, isError, isPending, mutate } = useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["userPosts"] });
            toast.success('Comment Creaed Successfully')
        },
        onError: () => {
            toast.error("Cannt Created Comment")
        }
    })

    function handelComment(values) {
        // console.log(values);
        if (!values.content && !values.image) return
        if (values.content) {
            formdata.append("content", values.content)
        }
        if (values.image) {
            formdata.append("image", values.image[0])
        }
        mutate();
    }

    return <>
        <form onSubmit={handleSubmit(handelComment)} id="form" className="flex gap-4 border-2 border-gray-200 rounded-lg px-5 py-4 mt-3 items-center">
            <label htmlFor="img"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            </label>
            <input {...register("image")} id='img' type="file" hidden />
            <textarea {...register("content")} id="input" rows={1} placeholder="Add your comment…" className=" outline-gray-500 flex-1 resize-none p-2 text-sm leading-relaxed" defaultValue={""} />
            <button className="outline-none4 py-2 rounded-xl bor text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </button>
        </form>
    </>
}
