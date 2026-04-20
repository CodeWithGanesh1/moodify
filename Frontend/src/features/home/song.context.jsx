import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    
    // 🔥 FIX: Isse array banao, default object nahi
    const [song, setSong] = useState([]); 

    return (
        <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
            {children}
        </SongContext.Provider>
    )
}