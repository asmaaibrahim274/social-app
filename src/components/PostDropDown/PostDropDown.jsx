import React, { useContext, useRef, useState } from 'react'
import { Ellipsis, Pencil, TrashBin } from "@gravity-ui/icons";
import { Button, Description, Dropdown, Label, Modal } from "@heroui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
// import { UserData } from '../context/UserData';

export default function PostDropDown({ id }) {

    let query = useQueryClient();
    const [modalCase, setmodalCase] = useState(false);
    // let { data: userData } = useContext(UserData);
    const [imgSrc, setimgSrc] = useState();
    let body = useRef();
    let image = useRef();

    function delPost() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: delData, mutate: delFn } = useMutation({
        mutationFn: delPost,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["userPosts"] });
            query.invalidateQueries({ queryKey: ["postDetails"] });
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

    function updatePost() {
        return axios.put(`https://route-posts.routemisr.com/posts/${id}`, handlePostData(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data: updData, mutate: ubdateFn } = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["userPosts"] });
        }
    })

    return <>
        <Dropdown>
            <Button isIconOnly aria-label="Menu" variant="Default">
                <Ellipsis className="outline-none" />
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                    console.log(`Selected: ${key}`);
                    if (key === "edit-file")
                        setmodalCase(true);
                }}>
                    <Dropdown.Section>
                        <Dropdown.Item id="edit-file" textValue="Edit file">
                            <div className="flex h-8 items-start justify-center pt-px">
                                <Pencil className="size-4 shrink-0 text-muted" />
                            </div>
                            <div className="flex flex-col">
                                <Label className='text-gray-700'>Edit post</Label>
                                <Description>Make changes</Description>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item  onClick={delFn} id="delete-file" textValue="Delete file" variant="danger">
                            <div className="flex h-8 items-start justify-center pt-px">
                                <TrashBin className="size-4 shrink-0 text-danger" />
                            </div>
                            <div className="flex flex-col">
                                <label>Delete post</label>
                                <Description>Move to trash</Description>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>

        {/* start model */}
        <Modal isOpen={modalCase} onOpenChange={setmodalCase}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-90">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Update Post</Modal.Heading>
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
                            <Button onClick={ubdateFn} className="w-full" slot="close">
                                Update
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
        {/* end model */}
    </>
}
