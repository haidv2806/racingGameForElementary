import Modal from "react-modal";
import { useState, type CSSProperties } from "react";
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

function QuestionModal({ isOpen, onClose, type, questnum, correctAnswersTeam, setCorrectAnswersTeam, numTeams }: QuestionModalProps) {
    const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false)
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

    function handleCloseModal() {
        onClose()
        setIsShowAnswer(false)
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            style={{
                overlay: styles.overlay,
                content: styles.content,
            }}
        >


            <div style={styles.container}>
                <div style={styles.imageWrapper}>
                    <h3 style={styles.heading}>{question.heading}</h3>
                    {/* Hình ảnh type */}
                    <img
                        src={`/questions/type_${type}.png`}
                        alt={`Type ${type}`}
                        style={styles.image}
                    />
                </div>

                <div style={styles.wrapper} onClick={() => setIsShowAnswer(true)}>
                    <p style={styles.question}>{question.questions}</p>
                    {isShowAnswer && (
                        <p style={styles.question}>{question.answer}</p>
                    )}
                </div>
            </div>

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
    container: {
        display: "flex",
        flexDirection: "row",
    },
    content: {
        position: "relative",
        inset: "auto",
        padding: 0,
        border: "none",
        background: "transparent",
        // maxWidth: "800px",
        width: "85%",
        overflow: "hidden",
    },
    wrapper: {
        flex: 1,
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center",
        width: "100%",
        alignContent: 'center'
    },
    title: {
        fontSize: "3rem",
        fontWeight: "bold",
    },
    heading: {
        fontSize: "3rem",
        fontWeight: "600",
        textAlign: "center",
        color: "#fff"
    },
    question: {
        fontSize: "3rem",
        color: "#fff"
    },
    imageWrapper: {
        flex: 2,
    },
    image: {
        flex: 2,
        width: "100%",
        height: "auto",
        borderRadius: "12px",
        marginBottom: "20px",
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
        textAlign: "center",
    },
};

export default QuestionModal;
