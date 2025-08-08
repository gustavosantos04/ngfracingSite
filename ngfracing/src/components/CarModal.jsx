import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
`;

const MainImage = styled.div`
  position: relative;
  flex: 1;
  min-height: 400px;
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageNavigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  
  button {
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(220, 38, 38, 0.9);
      transform: scale(1.1);
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 2px;
  }
`;

const Thumbnail = styled.button`
  min-width: 80px;
  height: 60px;
  border: 2px solid ${props => props.active ? '#dc2626' : '#374151'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  padding: 0;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #dc2626;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 3px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CarTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #374151;
    color: #ffffff;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 1rem;
`;

const BasicInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoCard = styled.div`
  background: #1f1f1f;
  border-radius: 8px;
  padding: 0.7rem;
  text-align: center;
  border: 1px solid #374151;
  
  .label {
    color: #9ca3af;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
  
  .value {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    color: #ffffff;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`;

const SpecsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #374151;
  color: #9ca3af;
  font-size: 0.9rem;
  
  .label {
    color: #ffffff;
  }
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const OptionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.9rem;
  padding: 0.25rem 0;
  
  &::before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
  }
`;

Modal.setAppElement('#root');

export default function CarModal({ car, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [car]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const calculateInstallment = () => {
    const price = parseInt(car.price.replace(/[^\d]/g, ''));
    const downPayment = price * 0.3; // 30% de entrada
    const financed = price - downPayment;
    const installment = financed / 60; // 60 meses
    return installment;
  };

  return (
    <Modal
      isOpen={!!car}
      onRequestClose={onClose}
      contentLabel={`Detalhes do ${car.brand} ${car.model}`}
      style={{
        content: {
          maxWidth: "1200px",
          width: "95%",
          height: "90%",
          margin: "auto",
          borderRadius: "16px",
          background: "#0a0a0a",
          border: "1px solid #374151",
          padding: "2rem",
          inset: "5%",
          zIndex: 9999,
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 9998,
        },
      }}
    >
      <ModalContent>
        <ImageSection>
          <MainImage>
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.brand} ${car.model} - Foto ${currentImageIndex + 1}`}
            />
            
            <ImageNavigation direction="left">
              <button onClick={prevImage} aria-label="Imagem anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>
            </ImageNavigation>
            
            <ImageNavigation direction="right">
              <button onClick={nextImage} aria-label="Próxima imagem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </ImageNavigation>
            
            <ImageCounter>
              {currentImageIndex + 1} de {car.images.length}
            </ImageCounter>
          </MainImage>
          
          <Thumbnails>
            {car.images.map((img, index) => (
              <Thumbnail
                key={index}
                active={index === currentImageIndex}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={img} alt={`Miniatura ${index + 1}`} />
              </Thumbnail>
            ))}
          </Thumbnails>
        </ImageSection>

        <InfoSection>
          <Header>
            <CarTitle>{car.brand} {car.model}</CarTitle>
            <CloseButton onClick={onClose} aria-label="Fechar modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseButton>
          </Header>

          <Price>{car.price}</Price>

          <BasicInfo>
            <InfoCard>
              <div className="label">Ano</div>
              <div className="value">{car.year}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">Quilometragem</div>
              <div className="value">{car.km.toLocaleString()} km</div>
            </InfoCard>
            <InfoCard>
              <div className="label">Combustível</div>
              <div className="value">{car.fuel}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">Câmbio</div>
              <div className="value">{car.transmission}</div>
            </InfoCard>
          </BasicInfo>

          <Section>
            <h3>Especificações Técnicas</h3>
            <SpecsList>
              {Object.entries(car.specs).map(([label, value]) => (
                <SpecItem key={label}>
                  <span className="label">{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                  <span>{value}</span>
                </SpecItem>
              ))}
            </SpecsList>
          </Section>

          <Section>
            <h3>Equipamentos e Opcionais</h3>
            <OptionsList>
              {car.options.map((option, index) => (
                <OptionItem key={index}>{option}</OptionItem>
              ))}
            </OptionsList>
          </Section>
        </InfoSection>
      </ModalContent>
    </Modal>
  );
}

