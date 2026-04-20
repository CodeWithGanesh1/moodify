import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";


export const useSong = () => {
    const context = useContext(SongContext);
    const { loading, setLoading, song, setSong } = context;

    async function handleGetSong({ mood }) {
        setLoading(true);
        try {
            const data = await getSong({ mood });
            console.log("API Response:", data);
            
            // 🔥 FIX: Check karo ki data.song array hai ya nahi
            if (data && data.song) {
                setSong(data.song); 
            } else {
                setSong([]); // Khali array set karo agar gaane na milein
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setSong([]);
        } finally {
            setLoading(false);
        }
    }

    return ({ loading, song, handleGetSong });
}