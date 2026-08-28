import axios from "axios"
import { use, useEffect, useState } from "react";
import PostCard from "../PostCard/PostCard";
import { PropagateLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../CreatePost/CreatePost";


export default function Home() {


    function getAllPosts() {
        return axios.get(`https://route-posts.routemisr.com/posts`, {
            // params : {sort : "createdAt"},
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, error, isError, isLoading, isFetched, isFetching } = useQuery({
        queryKey: ["getPosts"],
        queryFn: getAllPosts,
        select: ((res) => res.data.data.posts),
        refetchInterval: 3000
    })

    // console.log(data);

    if (isError) {
        return <div className="h-screen flex justify-center items-center">
            <h1>{error.message}</h1>
        </div>
    }

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center">
            <PropagateLoader />
        </div>
    }

    return <>
        <CreatePost />
        {data?.map((post) => {
            return <PostCard key={post.id} post={post} />
        })}
    </>
}
