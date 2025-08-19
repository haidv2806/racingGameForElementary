import Modal from "react-modal";
import type { CSSProperties } from "react";

Modal.setAppElement("#root"); // accessibility

type ThankYouModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function EnddingModal({ isOpen, onClose }: ThankYouModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: styles.overlay,
                content: styles.content,
            }}
            contentLabel="Thank You Modal"
        >
            {/* Nền hình ảnh */}
            <div style={styles.bg}>
                {/* Nút đóng nhỏ góc phải trên */}
                <button aria-label="Đóng" style={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                {/* Nội dung dọc: GIF -> Text */}
                <div style={styles.inner}>
                    <img src={'/robot/speak_and_clap.gif'} alt="Cảm ơn đã chơi" style={styles.gif} />
                    <div style={styles.textContainer}>
                        <h1 style={styles.heading}>Cảm ơn mọi người đã chơi! 🎉</h1>
                        <p style={styles.subtext}>
                            Hẹn gặp lại ở những đường đua tiếp theo!
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
        backdropFilter: "blur(0px)", // có thể tăng blur nếu muốn nổi bật chữ
    },
    gif: {
        width: "50vw", // yêu cầu: 50% viewport width
        maxWidth: 720,
        height: "auto",
        display: "block",
        marginBottom: 24,
    },
    textContainer: {
        background: "rgba(0,0,0,0.6)",
        padding: "16px 32px",
        borderRadius: "20px",
    },
    heading: {
        fontSize: "clamp(2rem, 6vw, 4rem)", // cỡ chữ lớn, responsive
        fontWeight: 900,
        color: "#ffffff",
        textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        margin: 0,
        lineHeight: 1.15,
    },
    subtext: {
        marginTop: 12,
        fontSize: "clamp(1.2rem, 3vw, 2rem)",
        fontWeight: 600,
        color: "#ffe7a8",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
    },
};

export default EnddingModal;
