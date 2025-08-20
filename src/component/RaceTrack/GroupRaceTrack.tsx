import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import RaceTrack, { type RaceTrackHandle } from "./RaceTrack";
import questionList from "../../questionList";
import QuestionModal from "../Modal/QuestionModal";
import WinnerModal from "../Modal/WinnerModal";
import EnddingModal from "../Modal/EnddingModal";

type GroupRaceTrackProps = {
  type: number;
  onNextStage: () => void; // báo cho cha tăng type
};

function GroupRaceTrack({ type, onNextStage }: GroupRaceTrackProps) {
  const typeKey = `type_${type}` as keyof typeof questionList;
  const questions = questionList[typeKey] || [];
  const totalQuestions = questions.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);
  const [isEnddingOpen, setIsEnddingOpen] = useState(false);
  const [correctAnswersTeam, setCorrectAnswersTeam] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [teamScores, setTeamScores] = useState<number[]>([0, 0, 0, 0]);

  const carsData = [
    { trackID: 1, carType: 6, carNumber: 1 },
    { trackID: 2, carType: 7, carNumber: 2 },
    { trackID: 3, carType: 8, carNumber: 3 },
    { trackID: 4, carType: 9, carNumber: 4 },
  ];
  const carRefs = carsData.map(() => useRef<RaceTrackHandle>(null));

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // chạy xe cho các đội đã chọn + cộng điểm
    const newScores = [...teamScores];
    correctAnswersTeam.forEach((team) => {
      carRefs[team - 1].current?.run();
      newScores[team - 1] += 1;
    });
    setTeamScores(newScores);

    // reset lựa chọn
    setCorrectAnswersTeam([]);
  };

  function handleOpenModal() {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setIsModalOpen(true);
    } else {
      setIsWinnerOpen(true);
    }
  }

  const handleNextStage = () => {
    if (type >= Object.keys(questionList).length) {
      setIsWinnerOpen(false);
      setIsModalOpen(false);
      setIsEnddingOpen(true);
      return;
    } else {
      setIsWinnerOpen(false);

      // reset toàn bộ state
      setCurrentQuestion(0);
      setTeamScores([0, 0, 0, 0]);
      setCorrectAnswersTeam([]);
      setIsModalOpen(false);

      // reset xe về vị trí ban đầu
      carRefs.forEach((ref) => ref.current?.reset());

      // gọi cha tăng type
      onNextStage();
    }
  };

  return (
    <div style={styles.container}>
      {carsData.map((car, index) => (
        <RaceTrack
          key={car.trackID}
          ref={carRefs[index]}
          trackID={car.trackID}
          carType={car.carType}
          carNumber={car.carNumber}
          SEGMENTS={totalQuestions}
        />
      ))}

      <QuestionModal
        isOpen={isModalOpen}
        correctAnswersTeam={correctAnswersTeam}
        setCorrectAnswersTeam={setCorrectAnswersTeam}
        onClose={handleCloseModal}
        type={type}
        questnum={currentQuestion}
        numTeams={carsData.length}
      />

      {!isModalOpen && !isWinnerOpen && (
        <button style={styles.nextBtn} onClick={handleOpenModal}>
          Câu tiếp theo
        </button>
      )}

      <WinnerModal
        type={type}
        isOpen={isWinnerOpen}
        teamScores={teamScores}
        carsData={carsData}
        onClose={handleNextStage}
      />

      <EnddingModal
        isOpen={isEnddingOpen}
        onClose={() => setIsEnddingOpen(false)}
      />
    </div>
  );
}


const styles: { [key: string]: CSSProperties } = {
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  nextBtn: {
    position: "absolute",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default GroupRaceTrack;
