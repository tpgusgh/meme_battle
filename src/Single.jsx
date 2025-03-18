import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f3f4f6;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #374151;
`;

const BattleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const CharacterCard = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 15rem;
  cursor: pointer;
`;

const ImagePlaceholder = styled.div`
  width: 10rem;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  border-radius: 0.75rem;
  color: #9ca3af;
  font-size: 1rem;
  position: relative;
`;

const PlusIcon = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #6b7280;
`;

const VSImage = styled.img`
  width: 12rem;
  height: 12rem;
`;

const BattleButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #ef4444;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WinnerText = styled.div`
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #dc2626;
  animation: bounce 1s infinite;
`;

export default function Single() {
  const [char1, setChar1] = useState("");
  const [char2, setChar2] = useState("");
  const [char1Url, setChar1Url] = useState("");
  const [char2Url, setChar2Url] = useState("");
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const uploadImage = async (event, setChar, setCharUrl) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setChar(file.name);
      setCharUrl(`http://localhost:8000/uploads/${res.data.filename}`);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
    }
  };

  const startBattle = async () => {
    try {
      const res = await axios.post("http://localhost:8000/battle/", {
        players: [char1, char2], 
      });
      const winner = res.data.winner === char1 ? "Player 1" : "Player 2";
      setWinner(winner);
  
      setTimeout(() => {
        navigate("/winner", { state: { winner, char1Url, char2Url } });
      }, 2000);
    } catch (error) {
      console.error("전투 시작 실패:", error);
    }
  };
  

  return (
    <Container>
      <Title>전투 시뮬레이션</Title>
      <BattleArea>
        <CharacterCard>
          <input type="file" style={{ display: "none" }} onChange={(e) => uploadImage(e, setChar1, setChar1Url)} />
          {char1Url ? (
            <img src={char1Url} style={{ width: "10rem", height: "10rem", borderRadius: "0.75rem", marginTop: "1rem" }} />
          ) : (
            <ImagePlaceholder>
              <PlusIcon>+</PlusIcon>
            </ImagePlaceholder>
          )}
          <div>Player 1</div>
        </CharacterCard>

        <VSImage src="src/assets/vs.png" alt="VS" />

        <CharacterCard>
          <input type="file" style={{ display: "none" }} onChange={(e) => uploadImage(e, setChar2, setChar2Url)} />
          {char2Url ? (
            <img src={char2Url} style={{ width: "10rem", height: "10rem", borderRadius: "0.75rem", marginTop: "1rem" }} />
          ) : (
            <ImagePlaceholder>
              <PlusIcon>+</PlusIcon>
            </ImagePlaceholder>
          )}
          <div>Player 2</div>
        </CharacterCard>
      </BattleArea>
      <BattleButton disabled={!char1 || !char2} onClick={startBattle}>
        ⚔️ 전투 시작!
      </BattleButton>
    </Container>
  );
}
