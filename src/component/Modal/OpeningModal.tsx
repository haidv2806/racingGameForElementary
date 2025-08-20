import { useEffect } from "react";
import Modal from "react-modal";
import type { CSSProperties } from "react";

Modal.setAppElement("#root"); // bắt buộc cho accessibility

type OpeningModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

let wellcomeMusic: HTMLAudioElement;

function OpeningModal({ isOpen, onClose }: OpeningModalProps) {

  useEffect(() => {
    if (!wellcomeMusic) {
      wellcomeMusic = new Audio("/audio/wellcome.mp3");
      // bgMusic.loop = true;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(wellcomeMusic);
      const gainNode = audioCtx.createGain();

      // Tăng gấp đôi âm lượng
      gainNode.gain.value = 5.0;

      source.connect(gainNode).connect(audioCtx.destination);

      // Resume context sau khi có interaction
      const resumeCtx = () => {
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        wellcomeMusic.play().catch(err => console.log("Không thể phát nhạc:", err));
        document.removeEventListener("click", resumeCtx);
      };

      document.addEventListener("click", resumeCtx);
    }
  }, []);


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: styles.overlay,
        content: styles.content,
      }}
    >
      <div style={styles.backgroundWrapper}>
        {/* Nền */}
        <img src="/theme.png" alt="Theme" style={styles.backgroundImg} />

        {/* Container căn giữa 3 phần tử */}
        <div style={styles.centerContainer}>
          {/* Text trên cùng */}
          <div style={styles.textContainer}>
            <div style={styles.title1}>THỬ THÁCH</div>
            <div style={styles.title2}>ĐƯỜNG ĐUA SIÊU TỐC</div>
          </div>

          {/* GIF */}
          <img src="/robot/waved.gif" alt="Race Opening" style={styles.gif} />

          {/* Nút đặc biệt ở dưới */}
          <button style={styles.button} onClick={onClose}>
            🏁 Vào đường đua
          </button>
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
  backgroundWrapper: {
    position: "relative",
    width: "100vw",
    textAlign: "center",
    overflow: "hidden",
  },
  backgroundImg: {
    width: "100vw",
    height: "100vh",
    display: "block",
  },
  centerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column", // xếp theo cột
    alignItems: "center",
    justifyContent: 'space-between',
    // gap: "24px", // khoảng cách giữa text - gif - button
    width: "100%",
    height: "100%",
  },
  textContainer: {
    background: "rgba(0,0,0,0.8)",
    padding: "16px 32px",
    borderRadius: "20px",
  },
  title1: {
    fontSize: "3.6rem",
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: "8px",
  },
  title2: {
    fontSize: "5rem",
    fontWeight: "bold",
    color: "#fff",
  },
  gif: {
    width: "50%",
    height: "auto",
  },
  button: {
    padding: "16px 40px",
    fontSize: "1.4rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff512f, #dd2476)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginBottom: "20px",
  },
};

export default OpeningModal;
