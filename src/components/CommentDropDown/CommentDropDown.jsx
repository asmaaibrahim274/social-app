import React from 'react'
import { Ellipsis, Pencil, TrashBin } from "@gravity-ui/icons";
import { Button, Description, Dropdown, Label, Modal } from "@heroui/react";
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CommentDropDown({ commentId, postId }) {

    let query = useQueryClient();

    function deleteComment() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { mutate: delFn} = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ["getPosts"] });
            query.invalidateQueries({ queryKey: ["userPosts"] });
            query.invalidateQueries({ queryKey: ["allComments"] });
            query.invalidateQueries({ queryKey: ["postDetails"] });
        },
    })


    return <>
        <Dropdown>
            <Button isIconOnly aria-label="Menu" variant="Default">
                <Ellipsis className="outline-none" />
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                    console.log(`Selected: ${key}`);
                }}>
                    <Dropdown.Section>
                        <Dropdown.Item id="edit-file" textValue="Edit file">
                            <div className="flex h-8 items-start justify-center pt-px">
                                <Pencil className="size-4 shrink-0 text-muted" />
                            </div>
                            <div className="flex flex-col">
                                <Label className='text-gray-700'>Edit comment</Label>
                                <Description>Make changes</Description>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={delFn} id="delete-file" textValue="Delete file" variant="danger">
                            <div className="flex h-8 items-start justify-center pt-px">
                                <TrashBin className="size-4 shrink-0 text-danger" />
                            </div>
                            <div className="flex flex-col">
                                <label>Delete comment</label>
                                <Description>Move to trash</Description>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    </>
}
