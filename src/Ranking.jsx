import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const WinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.rank === 1 ? "#f9e06b" :
    props.rank === 2 ? "#d9d9d9" :
    props.rank === 3 ? "#e48873" : "#e0e0e0"};
  border-radius: 10px;
  padding: 20px;
  width: 200px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px;
`;

const WinnerImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-top: 10px;
`;

const Winner = ({ rank, name, image, wins }) => (
  <WinnerContainer rank={rank}>
    <h2>#{rank} {name}</h2>
    <p>wins: {wins}</p>
    {rank <= 3 && <WinnerImage src={image} alt={name} />}
  </WinnerContainer>
);

const WinnerPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f4;
  min-height: 100vh;
  padding: 20px;
`;

const WinnerList = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
`;

const WinnerItem = styled.div`
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  width: 80%;
  display: flex;
  justify-content: space-between;
`;

const RestartButton = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;

const Ranking = () => {
  const navigate = useNavigate(); 
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch("http://localhost:8000/ranking"); 
        const data = await response.json();
        setWinners(data);
      } catch (error) {
        console.error("랭킹 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return <WinnerPageContainer>데이터를 불러오는 중...</WinnerPageContainer>;
  }

  if (!winners || winners.length === 0) {
    return <WinnerPageContainer>순위 데이터가 없습니다.</WinnerPageContainer>;
  }

  const sortedWinners = [...winners].sort((a, b) => b.wins - a.wins);

  return (
    <WinnerPageContainer>
      <WinnerList>
        {sortedWinners.slice(0, 3).map((winner, index) => (
          <Winner key={index} rank={index + 1} name={winner.name} image={winner.image} wins={winner.wins} />
        ))}
      </WinnerList>
      {sortedWinners.slice(3).map((winner, index) => (
        <WinnerItem key={index}>
          <span>#{index + 4} {winner.name}</span>
          <span>wins : {winner.wins}</span>
        </WinnerItem>
      ))}
      <RestartButton onClick={() => navigate("/")}>홈으로 가기</RestartButton>
    </WinnerPageContainer>
  );
};

export default Ranking;
