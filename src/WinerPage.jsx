import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";


const RankingButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 0.5rem;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background-color: #1e3a8a;
  }
`;



const WinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f3f4f6;
`;

const WinnerText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #374151;
`;

const WinnerImage = styled.img`
  width: 15rem;
  height: 15rem;
  border-radius: 1rem;
  margin-top: 2rem;
`;

const CharacterInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const CharacterName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 1rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  margin-top: 1rem;
  width: 80%;
`;

const SubmitButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default function WinnerPage() {
    const { state } = useLocation();
    const { winner, char1Url, char2Url, char1Name, char2Name } = state;
    const navigate = useNavigate();
  
    const winnerImage = winner === "Player 1" ? char1Url : char2Url;
    const winnerName = winner === "Player 1" ? char1Name : char2Name;
  
    const [inputName, setInputName] = useState(""); 
    const [dots, setDots] = useState("");
    const [showContent, setShowContent] = useState(false);
  
    useEffect(() => {
      if (dots.length < 5) {
        const interval = setInterval(() => {
          setDots((prevDots) => (prevDots.length < 4 ? prevDots + "." : prevDots + "."));
        }, 1000);
        return () => clearInterval(interval);
      } else if (dots.length === 5 && !showContent) {
        setShowContent(true);
      } else {
        const interval = setInterval(() => {
          setDots((prevDots) => prevDots + "!");
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [dots]);
  
    const handlerank = async () => {
      console.log("🔍 name:", inputName);  
      console.log("🔍 img_url:", winnerImage);
  
      if (!inputName) {
        alert("이름을 입력해주세요!");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8000/save_character/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputName,  
            wins: 1,
            img_url: winnerImage
          }),
        });
  
        if (response.ok) {
          alert("우승자 정보가 저장되었습니다!");
          navigate("/ranking");
        } else {
          const errorData = await response.json();
          console.error("저장 실패:", errorData);
          alert("저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error saving winner:", error);
        alert("오류가 발생했습니다.");
      }
    };
  
    const handlemain = async () => {
      console.log("🔍 name:", inputName);  
      console.log("🔍 img_url:", winnerImage);
  
      if (!inputName) {
        alert("이름을 입력해주세요!");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8000/save_character/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputName,  
            wins: 1,
            img_url: winnerImage
          }),
        });
  
        if (response.ok) {
          alert("우승자 정보가 저장되었습니다!");
          navigate("/");
        } else {
          const errorData = await response.json();
          console.error("저장 실패:", errorData);
          alert("저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error saving winner:", error);
        alert("오류가 발생했습니다.");
      }
    };
    return (
      <WinnerContainer>
        {showContent && (
          <>
            <WinnerText>🎉 승자: {winner} !!!</WinnerText>
            <WinnerImage src={winnerImage} alt="Winner" />
            <div style={{ marginTop: "2rem" }}>
              <div>
                <Input 
                  type="text" 
                  value={inputName} 
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="이름 작성하기"
                />
              </div>
            </div>
            <SubmitButton onClick={handlemain}>메인 페이지로 돌아가기</SubmitButton>
            <RankingButton onClick={handlerank}>제출</RankingButton>
          </>
        )}
        {!showContent && <WinnerText>우승자는 {dots}</WinnerText>}
      </WinnerContainer>
    );
  }
  