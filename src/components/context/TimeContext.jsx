import { createContext } from "react";

export let TimeContext = createContext();

export function TimeContextProvider({ children }) {

    function getHoursAgo(isoDate) {
        const postDate = new Date(isoDate);
        const now = new Date();
        const diffInMs = now - postDate;
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor(diffInMs / (1000 * 60));
        if (hours < 1) {
            if (minutes < 1) return "now";
            return `${minutes} minutes`;
        } else if (hours === 1) {
            return "1 hour ago";
        } else if (hours === 2) {
            return "2 hours ago";
        } else {
            return hours;
        }
    }

    return <TimeContext.Provider value={{ getHoursAgo }}>
        {children}
    </TimeContext.Provider>
}