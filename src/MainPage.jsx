import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: white;
`;

const Banner = styled.div`
  width: 120%;
  background-color: #0000ff;
  color: white;
  font-size: 5rem;
  font-weight: bold;
  padding: 80px 0;
  text-align: center;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 48px;
  width: 66%;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #6b7bdd;
  color: white;
  font-size: 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6acb;
  }
`;

const MainPage = () => {
  const navigate = useNavigate(); 

  const handleSinglePlayerClick = () => {
    navigate("/single");
  };

  const handlerank = () => {
    navigate("/ranking");
  };

  
  return (
    <Container>
      <Banner>BATTLE SIMULATOR</Banner>
      <ButtonList>
        <Button onClick={handleSinglePlayerClick}>싱글플레이</Button>
        <Button>멀티플레이</Button>
        <Button onClick={handlerank}>랭킹</Button>
      </ButtonList>
    </Container>
  );
};

export default MainPage;
