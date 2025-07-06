import styled from 'styled-components';
import sobreBgImg from '../assets/carro-corrida-antigo.jpg';
import sobreImg from '../assets/image.jpg';

const SobreSection = styled.section`
  position: relative;
  padding: 80px 20px;
  color: #fff;
  overflow: hidden;
`;

const SobreBg = styled.div`
  position: absolute;
  inset: 0;
  background: url(${sobreBgImg}) center/cover no-repeat;
  filter: brightness(0.3);
  z-index: 1;
`;

const SobreContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: auto;
  gap: 40px;
`;

const SobreTexto = styled.div`
  flex: 2 1 600px;
`;

const Titulo = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Paragrafo = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const LinhaTempo = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Etapa = styled.div`
  background: rgba(255, 255, 255, 0.1);
  font-family: 'Montserrat', sans-serif;
  border-left: 4px solid #ffee00;
  padding: 10px 15px;
  border-radius: 8px;
  flex: 1;
  min-width: 150px;
`;

const Ano = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 5px;
  color: #ffee00;
`;

const BotaoConversao = styled.a`
  background-color: #fd2020;
  font-family: 'Orbitron', sans-serif;
  padding: 12px 24px;
  color: #ffffff;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.3s;
  display: inline-block;
  text-decoration: none;

  &:hover {
    background-color: #ce0000;
    color: #fff;
  }
`;

const SobreImagem = styled.div`
  flex: 1 1 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  max-width: 500px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-left: 20px;
  object-fit: cover;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

export default function Sobre() {
  return (
    <SobreSection id="sobre">
      <SobreBg />
      <SobreContainer>
        <SobreTexto>
          <Titulo>Nossa História nas Pistas</Titulo>
          <Paragrafo>
            Por mais de 10 anos, aceleramos forte nas pistas de arrancada pelo Brasil.
            A paixão por performance começou nas pistas, com motores forjados e vitórias marcantes.
            Hoje, essa mesma dedicação move a NGF Racing, agora como referência na venda de carros e peças de alta performance.
          </Paragrafo>
          <LinhaTempo>
            <Etapa>
              <Ano>2009</Ano>
              <p>Início nas corridas de arrancada</p>
            </Etapa>
            <Etapa>
              <Ano>2019</Ano>
              <p>Pausa da carreira nas pistas</p>
            </Etapa>
            <Etapa>
              <Ano>Hoje</Ano>
              <p>Loja especializada em performance e veículos diferenciados</p>
            </Etapa>
          </LinhaTempo>
          <BotaoConversao href="#contato">Venha nos conhecer</BotaoConversao>
        </SobreTexto>
        <SobreImagem>
          <Img src={sobreImg} alt="Loja atual da NGF Racing" />
        </SobreImagem>
      </SobreContainer>
    </SobreSection>
  );
}
