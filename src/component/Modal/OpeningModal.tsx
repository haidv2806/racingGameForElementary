import React from "react";
import Modal from "react-modal";
import type { CSSProperties } from "react";

Modal.setAppElement("#root"); // bắt buộc cho accessibility

type OpeningModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function OpeningModal({ isOpen, onClose }: OpeningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: styles.overlay,
        content: styles.content,
      }}
    >
      <div style={styles.container}>
        {/* GIF intro */}
        <img
          src="/robot/waved.gif" // thay bằng gif thật
          alt="Race Opening"
          style={styles.gif}
        />

        {/* Title */}
        <div style={styles.title1}>THỬ THÁCH</div>
        <div style={styles.title2}>ĐƯỜNG ĐUA SIÊU TỐC</div>

        {/* Nút đóng */}
        <button style={styles.button} onClick={onClose}>
          Bắt đầu
        </button>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: CSSProperties } = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  content: {
    position: "relative",
    inset: "auto",
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "#1a1a1a",
    maxWidth: "400px",
    width: "90%",
    margin: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
  },
  gif: {
    width: "200px",
    height: "200px",
    objectFit: "contain",
    marginBottom: "20px",
  },
  title1: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#FFD700", // vàng
    marginBottom: "8px",
  },
  title2: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "20px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 24px",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
};

export default OpeningModal;
