import Modal from "react-modal";
import { useState } from "react";
import type { CSSProperties } from "react";
import questionList from "../../questionList";

Modal.setAppElement("#root");

type QuestionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    type: number;      // ví dụ 1 -> type_1
    questnum: number;  // ví dụ 2 -> câu hỏi thứ 2
    correctAnswersTeam: number[]; // mảng các đội trả lời đúng
    setCorrectAnswersTeam: React.Dispatch<React.SetStateAction<number[]>>;
    numTeams: number;
};

function QuestionModal({ isOpen, onClose, type, questnum, correctAnswersTeam, setCorrectAnswersTeam , numTeams}: QuestionModalProps) {
    // const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
    const typeKey = `type_${type}` as keyof typeof questionList;
    const questions = questionList[typeKey] || [];
    const question = questions[questnum - 1]; // questnum bắt đầu từ 1

    if (!question) {
        return null;
    }

    // Toggle chọn đội
    const toggleTeam = (team: number) => {
        setCorrectAnswersTeam((prev) =>
            prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: styles.overlay,
                content: styles.content,
            }}
        >
            <div style={styles.wrapper}>
                {/* Title */}
                <h2 style={styles.title}>{question.title}</h2>

                {/* Heading */}
                <h3 style={styles.heading}>{question.heading}</h3>

                {/* Hình ảnh */}
                <img
                    src={`/questions/type_${type}.png`}
                    alt={`Type ${type}`}
                    style={styles.image}
                />

                {/* Question */}
                <p style={styles.question}>{question.questions}</p>

                {/* 4 Hộp chọn đội */}
                <div style={styles.teamsWrapper}>
                    {Array.from({ length: numTeams }, (_, i) => i + 1).map((team) => (
                        <div
                            key={team}
                            style={{
                                ...styles.teamBox,
                                backgroundColor: correctAnswersTeam.includes(team)
                                    ? "#ff512f"
                                    : "#eee",
                                color: correctAnswersTeam.includes(team) ? "#fff" : "#333",
                            }}
                            onClick={() => toggleTeam(team)}
                        >
                            Đội {team}
                        </div>
                    ))}
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
        maxWidth: "800px",
        width: "90%",
        overflow: "hidden",
    },
    wrapper: {
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center",
    },
    title: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        marginBottom: "12px",
    },
    heading: {
        fontSize: "1.2rem",
        fontWeight: "600",
        marginBottom: "20px",
    },
    image: {
        width: "100%",
        height: "auto",
        borderRadius: "12px",
        marginBottom: "20px",
    },
    question: {
        fontSize: "1.1rem",
        marginBottom: "24px",
    },
    button: {
        padding: "16px 32px",
        fontSize: "1.6rem",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #ff512f, #dd2476)",
        color: "#fff",
        border: "none",
        borderRadius: "30px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    },
    teamsWrapper: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
        gap: "12px",
    },
    teamBox: {
        flex: 1,
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
    },
};

export default QuestionModal;
