import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "./FaceExpression.scss";

export default function FaceExpression({ onClick = () => {} }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            // cleanup landmarker
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            // stop camera
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    // ✅ FIXED FUNCTION
    async function handleClick() {
        try {
            const exp = await detect({
                landmarkerRef,
                videoRef,
                setExpression
            });

            if (!exp) return;

            // ✅ history store
            const history = JSON.parse(localStorage.getItem("moodHistory")) || [];

            history.unshift({
                mood: exp,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            });

            // optional: limit history size (avoid infinite growth)
            const limitedHistory = history.slice(0, 50);

            localStorage.setItem("moodHistory", JSON.stringify(limitedHistory));

            console.log("Detected:", exp);

            onClick(exp);
        } catch (error) {
            console.error("Detection error:", error);
            setExpression("Error detecting 😢");
        }
    }

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
                autoPlay
            />
            <h2>{expression}</h2>
            <button onClick={handleClick}>
                Detect Expression
            </button>
        </div>
    );
}
