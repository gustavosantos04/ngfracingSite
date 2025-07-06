import styled, { keyframes } from 'styled-components';
import heroImg from '../assets/hero-car.jpg';

const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  background-image: url(${heroImg});
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  text-align: center;
  color: white;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0; */
  background-color: rgba(0, 0, 0, 0.5); /* meio transparente, ajusta aqui a opacidade */
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  animation: ${fadeSlideUp} 1s ease forwards;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.a`
  background-color:rgb(231, 0, 0);
  color: #ffff;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  box-shadow: 0 4px 8pxrgba(200, 0, 0, 0.73);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #c80000;
    transform: translateY(-3px);
  }
`;

export default function Hero() {
  return (
    <HeroSection id="home">
      <Overlay />
      <Content>
        <Title>Acelerando rumo à sua melhor conquista sobre quatro rodas.</Title>
        <Subtitle>
          NGF Racing — veículos selecionados com qualidade, performance e confiança para quem valoriza cada detalhe.
        </Subtitle>
        <ButtonGroup>
          <Button href="#estoque">Ver Estoque</Button>
          <Button href="#contato">Solicitar Orçamento</Button>
        </ButtonGroup>
      </Content>
    </HeroSection>
  );
}
