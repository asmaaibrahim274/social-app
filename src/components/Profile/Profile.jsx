import React, { useContext } from 'react'
import { UserData } from '../context/UserData'
import axios from 'axios';
import { dataTagErrorSymbol, useQuery } from '@tanstack/react-query';
import PostCard from './../PostCard/PostCard';
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Profile() {

  let { data } = useContext(UserData);

  function getUserPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${data.id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }


  let { data: userposts } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPosts,
    select: (res) => res?.data.data.posts
  })

  // console.log(userposts);

  // console.log(data);

  

  return <>
    <section className="mt-10 p-4 min-h-screen">
      <div className="w-full md:w-1/2 md:mx-auto text-center mb-15">

        {/* user data & photo */}
        <div className='flex flex-col md:flex-row items-center justify-center mb-6'>
          <img className="inline-flex object-cover border-4 border-indigo-600 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-indigo-600 bg-indigo-50 h-24 w-24 mb-4 md:mb-0 ml-0 md:mr-5" src={data?.photo} alt="" />
          <div className="flex flex-col">
            <div className="md:text-justify mb-3">
              <div className="flex flex-col mb-5">
                <p className="text-indigo-900 font-bold text-xl">
                  {data?.name}
                </p>
              </div>
              <p className="text-indigo-300 font-semibold text-center md:text-left mb-1">
                UserName : {data?.username}
              </p>
              <p className="text-indigo-300 font-semibold text-center md:text-left">
                Email : {data?.email}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* user posts */}
      {userposts?.map((post) => {
        return <PostCard key={post.id} post={post} />
      })}
    </section>


  </>
}
