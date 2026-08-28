import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";

export let UserData = createContext();

export function UserDataProvider({ children }) {

    function getUserData() {
        return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }

    let { data } = useQuery({
        queryKey: ["userData"],
        queryFn: getUserData,
        select: (res) => res?.data.data.user
    })

    // console.log(data);

    const [token, settoken] = useState(localStorage.getItem("userToken"));

    return <UserData.Provider value={{ token, settoken, data }}>
        {children}
    </UserData.Provider>
}