import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import type { CSSProperties } from "react";

Modal.setAppElement("#root");

type OpeningModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function OpeningModal({ isOpen, onClose }: OpeningModalProps) {
  const [stage, setStage] = useState<
    "Opening" | "Stage1" | "Stage1Finish" | "stage2" | "Stage2Finish"
  >("Opening");

  let audio: string = "";
  let title1: string = "";
  let title2: string = "";
  let gif: string = "";

  switch (stage) {
    case "Stage1":
      audio = "/audio/stage_1.mp3";
      title1 = "CHẶNG 1";
      title2 = "XƯỞNG CHẾ TẠO CỦA VIỆT";
      gif = "/robot/waved.gif";
      break;
    case "Stage1Finish":
      audio = "/audio/stage_1_finish.mp3";
      title1 = "CHÚC MỪNG";
      title2 = "CÁC BẠN ĐÃ VƯỢT QUA CHẶNG 1 🎉";
      gif = "/robot/clap.gif";
      break;
    case "stage2":
      audio = "/audio/stage_2.mp3";
      title1 = "CHẶNG 2";
      title2 = "KHU VƯỜN PHÉP THUẬT";
      gif = "/robot/waved.gif";
      break;
    case "Stage2Finish":
      audio = "/audio/stage_2_finish.mp3";
      title1 = "CHÚC MỪNG";
      title2 = "BẠN ĐÃ VỀ ĐÍCH";
      gif = "/robot/clap.gif";
      break;
    default:
      audio = "/audio/wellcome.mp3";
      title1 = "THỬ THÁCH";
      title2 = "ĐƯỜNG ĐUA SIÊU TỐC";
      gif = "/robot/waved.gif";
      break;
  }

  // Phát nhạc khi stage đổi
      const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

      useEffect(() => {
        if (isOpen) {
            // nếu đang mở modal
            if (!audioRef.current) {
                audioRef.current = new Audio(audio);
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
    }, [isOpen, stage]);

  // useEffect(() => {
  //   if (!audio) return;

  //   // Dừng nhạc cũ
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //   }

  //   // Tạo nhạc mới
  //   const newAudio = new Audio(audio);
  //   newAudio.volume = 1.0;
  //   audioRef.current = newAudio;

  //   // Do browser chặn autoplay, nên phải click 1 lần mới play được
  //   const resumePlay = () => {
  //     newAudio.play().catch(err => console.log("Không thể phát nhạc:", err));
  //     document.removeEventListener("click", resumePlay);
  //   };
  //   document.addEventListener("click", resumePlay);

  //   return () => {
  //     newAudio.pause();
  //   };
  // }, [stage]);

  function handleCloseModal() {
    if (stage == "Opening") {
      setStage("Stage1");
    } else if (stage == "Stage1") {
      onClose();
      setStage("Stage1Finish");
    } else if (stage == "Stage1Finish") {
      setStage("stage2");
    } else if (stage == "stage2") {
      onClose();
      setStage("Stage2Finish");
    } else if (stage == "Stage2Finish") {
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      style={{ overlay: styles.overlay, content: styles.content }}
    >
      <div style={styles.backgroundWrapper}>
        <img src="/theme.png" alt="Theme" style={styles.backgroundImg} />
        <div style={styles.centerContainer}>
          <div style={styles.textContainer}>
            <div style={styles.title1}>{title1}</div>
            <div style={styles.title2}>{title2}</div>
          </div>
          <img src={gif} alt="Race Opening" style={styles.gif} />
          <button style={styles.button} onClick={handleCloseModal}>
            🏁 Vào đường đua
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: CSSProperties } = {
  overlay: { backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 },
  content: { position: "relative", inset: "auto", padding: 0, border: "none", background: "transparent", width: "100vw", maxWidth: "100%", overflow: "hidden" },
  backgroundWrapper: { position: "relative", width: "100vw", textAlign: "center", overflow: "hidden" },
  backgroundImg: { width: "100vw", height: "100vh", display: "block" },
  centerContainer: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" },
  textContainer: { background: "rgba(0,0,0,0.8)", padding: "16px 32px", borderRadius: "20px" },
  title1: { fontSize: "3.6rem", fontWeight: "bold", color: "#FFD700", marginBottom: "8px" },
  title2: { fontSize: "5rem", fontWeight: "bold", color: "#fff" },
  gif: { width: "50%", height: "auto" },
  button: { padding: "16px 40px", fontSize: "1.4rem", fontWeight: "bold", background: "linear-gradient(90deg, #ff512f, #dd2476)", color: "#fff", border: "none", borderRadius: "30px", cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.5)", transition: "transform 0.2s ease, box-shadow 0.2s ease", marginBottom: "20px" }
};

export default OpeningModal;