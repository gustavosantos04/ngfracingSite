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

  @media (max-width: 768px) {
    background-attachment: scroll; /* melhora performance mobile */
    padding: 0 1rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  animation: ${fadeSlideUp} 1s ease forwards;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
`;

const Button = styled.a`
  font-family: 'Orbitron', sans-serif;
  background-color: rgb(231, 0, 0);
  color: #fff;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(200, 0, 0, 0.73);

  &:hover {
    background-color: #c80000;
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
    text-align: center;
  }
`;

export default function Hero() {
  return (
    <HeroSection id="home">
      <Overlay />
      <Content>
        <Title>Acelerando rumo à sua melhor conquista sobre quatro rodas.</Title>
        <Subtitle>
          NGF Racing — vendendo qualidade e procedência desde 2013.
        </Subtitle>
        <ButtonGroup>
          <Button href="#estoque">Ver Estoque</Button>
          <Button href="#contato">Solicitar Orçamento</Button>
        </ButtonGroup>
      </Content>
    </HeroSection>
  );
}
