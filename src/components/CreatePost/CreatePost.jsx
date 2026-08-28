import React, { useContext, useRef, useState } from 'react';
import { Button, Modal } from "@heroui/react";
import { TextArea } from '@heroui/react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserData } from '../context/UserData';

export default function CreatePost() {

    let { data: userData } = useContext(UserData);

    let body = useRef();
    let image = useRef();

    let query = useQueryClient();

    const [imgSrc, setimgSrc] = useState();

    function createPost() {
        return axios.post(`https://route-posts.routemisr.com/posts`, handlePostData(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data, mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            setimgSrc(null);
            query.invalidateQueries({ queryKey: ["getPosts"] });
            toast.success("Post Creaed Successfully");
        },
        onError: () => {
            toast.error("Cannt Created Post");
        }
    })

    function closeImg() {
        // console.log("hello"); 
        setimgSrc(null);
        URL.revokeObjectURL(imgSrc);
        image.current.value = "";
        // console.log(image.current.files[0]);    
    }

    function previweImage(e) {
        // console.log(e.target.files[0]); 
        setimgSrc(URL.createObjectURL(e.target.files[0]));
    }

    function handlePostData() {
        let formData = new FormData();
        if (body.current.value) {
            formData.append("body", body.current.value);
        }
        if (image.current.files[0]) {
            formData.append("image", image.current.files[0]);
        }
        return formData;
    }
    

    return <>
        {/* start model */}
        <Modal>
            <section className="bg-white p-4 rounded shadow w-1/2 mx-auto my-4 py-6">
                <div className="flex items-center space-x-3">
                    <img className='h-10 w-10 rounded-full' src={userData?.photo} alt="" />
                    <Button className="w-full text-black" variant="secondary"><input type="text" placeholder="What's on your mind?" className='outline-none' /></Button>
                </div>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-90">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Add Post</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body >
                                <div className='flex gap-3 items-end'>
                                    <textarea ref={body}
                                        aria-label="Quick project update"
                                        className="h-32 w-full resize-none p-4 rounded-2xl outline-gray-300"
                                        placeholder="Enter your post body..."></textarea>
                                    <label htmlFor="upload"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg></label>
                                    <input ref={image} onChange={previweImage} type="file" id='upload' hidden />
                                </div>
                                {imgSrc && <div className='w-[90%] mt-4 flex gap-1.5'>
                                    <img className='w-full rounded-2xl' src={imgSrc} alt="" />
                                    <div>
                                        <svg onClick={closeImg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                </div>}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={mutate} className="w-full" slot="close">
                                    Create
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </section >
        </Modal>
        {/* end model */}
    </>
}
