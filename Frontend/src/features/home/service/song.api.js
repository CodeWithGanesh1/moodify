import axios from "axios";


const api = axios.create({
    baseURL: "https://moodify-1-3m7i.onrender.com",
    withCredentials: true
})


export async function getSong({ mood }) {
    const response = await api.get("/api/songs?mood=" + mood)
    console.log(response)
    return response.data
}