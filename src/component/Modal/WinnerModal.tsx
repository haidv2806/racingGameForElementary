import type { CSSProperties } from "react";
import questionList from "../../questionList";

type WinnerModalProps = {
    type: number;
    isOpen: boolean;
    teamScores: number[];
    carsData: { trackID: number; carType: number; carNumber: number }[];
    onClose: () => void;
};

function WinnerModal({ type, isOpen, teamScores, carsData, onClose }: WinnerModalProps) {
    if (!isOpen) return null;

    const sorted = teamScores
        .map((score, i) => ({
            team: carsData[i].carNumber,
            score,
            carType: carsData[i].carType,
        }))
        .sort((a, b) => b.score - a.score);

    let rank = 1;
    const ranking = sorted.map((item, i) => {
        if (i > 0 && item.score < sorted[i - 1].score) {
            rank = i + 1;
        }
        return { ...item, rank };
    });

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.text}>Chúc mừng bạn đã về đích chặng {type} 🎉</h2>

                {/* <div style={styles.carBox}>
                    <img
                        src={`/trophy.png`}
                        alt={`Xe đội ${ranking[0].team}`}
                        style={styles.trophyImg}
                    />
                    <img
                        src={`/cars/type_${ranking[0].carType}.png`}
                        alt={`Xe đội ${ranking[0].team}`}
                        style={styles.carImg}
                    />
                    <div style={styles.text}>Điểm: {ranking[0].score}</div>
                </div> */}

                <div style={styles.carsRow}>
                    {ranking.map((r) => (
                        <div key={r.team} style={styles.carBox}>
                            {r.team == ranking[0].team && (
                                <img
                                    src={`/trophy.png`}
                                    alt={`Xe đội ${ranking[0].team}`}
                                    style={styles.trophyImg}
                                />
                            )}
                            <img
                                src={`/cars/type_${r.carType}.png`}
                                alt={`Xe đội ${r.team}`}
                                style={styles.carImg}
                            />
                            <div style={styles.text}>Điểm: {r.score}</div>
                        </div>
                    ))}
                </div>

                <button onClick={onClose} style={styles.closeBtn}>
                    {type >= Object.keys(questionList).length
                        ? "Kết thúc trò chơi"
                        : "Đi đến đường đua kế tiếp"}
                </button>
            </div>
        </div>
    );
}


const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "80%",
        textAlign: "center",
    },
    carsRow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "50px",
        margin: "20px 0",
    },
    carBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    trophyImg: {
        width: "400px",
        height: "auto",
    },
    carImg: {
        width: "120px",
        height: "auto",
    },
    text: {
        fontSize: "3rem",
        fontWeight: "bold",
        marginTop: "6px",
        color: "#333",
    },
    closeBtn: {
        marginTop: "10px",
        padding: "6px 14px",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default WinnerModal;
