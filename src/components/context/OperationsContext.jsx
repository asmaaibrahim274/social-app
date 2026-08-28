import { createContext, useState } from "react";

export let OperationsContext = createContext();

export function OperationsContextProvider({ children }) {

    // Like & Unlike Post


      
 



    return <OperationsContext.Provider value={{ count, setcount }}>
        {children}
    </OperationsContext.Provider>
}