import { useEffect, useRef } from "react";
import Modal from "react-modal";
import type { CSSProperties } from "react";

Modal.setAppElement("#root"); // accessibility

type ThankYouModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function EnddingModal({ isOpen }: ThankYouModalProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (isOpen) {
            // nếu đang mở modal
            if (!audioRef.current) {
                audioRef.current = new Audio("/audio/ending.mp3");
                audioCtxRef.current = new AudioContext();
                const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
                const gainNode = audioCtxRef.current.createGain();
                gainNode.gain.value = 1.0; // volume bình thường

                source.connect(gainNode).connect(audioCtxRef.current.destination);

                const resumeCtx = () => {
                    if (audioCtxRef.current?.state === "suspended") {
                        audioCtxRef.current.resume();
                    }
                    audioRef.current?.play().catch(err => console.log("Không thể phát nhạc:", err));
                    document.removeEventListener("click", resumeCtx);
                };
                document.addEventListener("click", resumeCtx);
            } else {
                // Nếu đã có audio thì play lại
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            // modal đóng -> stop nhạc
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

        // cleanup khi unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
        };
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            //   onRequestClose={onClose}
            style={{
                overlay: styles.overlay,
                content: styles.content,
            }}
            contentLabel="Thank You Modal"
        >
            <div style={styles.bg}>
                <div style={styles.inner}>
                    <img
                        src={"/robot/speak_and_clap.gif"}
                        alt="Cảm ơn đã chơi"
                        style={styles.gif}
                    />
                    <div style={styles.textContainer}>
                        <p style={styles.subtext}>
                            Hẹn gặp lại các bạn ở những chặng đua tiếp theo!
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const styles: { [key: string]: CSSProperties } = {
    overlay: {
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    content: {
        position: "relative",
        inset: "auto",
        padding: 0,
        border: "none",
        background: "transparent",
        width: "100vw",
        maxWidth: "100%",
        overflow: "hidden",
    },
    bg: {
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        backgroundImage: "url(/theme.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    },
    closeBtn: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        fontSize: 18,
        lineHeight: "36px",
        textAlign: "center",
    },
    inner: {
        width: "100%",
        minHeight: "100vh",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    gif: {
        width: "50vw",
        maxWidth: 720,
        height: "auto",
        display: "block",
        marginBottom: 24,
    },
    textContainer: {
        background: "rgba(0,0,0,0.8)",
        padding: "16px 32px",
        borderRadius: "20px",
    },
    subtext: {
        marginTop: 12,
        fontSize: "3.5rem",
        fontWeight: 600,
        color: "#ffe7a8",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
    },
};

export default EnddingModal;