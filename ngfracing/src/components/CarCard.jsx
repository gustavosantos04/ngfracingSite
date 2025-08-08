import styled from 'styled-components';
import { useState } from 'react';

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #374151;
  position: relative;
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    transform: translateY(-8px);
    border-color: #dc2626;
    box-shadow: 0 20px 40px rgba(220, 38, 38, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 220px;
`;

const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(220, 38, 38, 0.9);
    transform: scale(1.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.isFavorite ? '#dc2626' : 'transparent'};
    stroke: ${props => props.isFavorite ? '#dc2626' : '#ffffff'};
    stroke-width: 2;
  }
`;

const Info = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CarTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.3rem;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
`;

const Price = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #dc2626;
  text-align: right;
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.9rem;
  
  .icon {
    width: 16px;
    height: 16px;
    color: #dc2626;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ViewDetailsButton = styled.button`
  flex: 1;
  background: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b91c1c;
    transform: translateY(-2px);
  }
`;

export default function CarCard({ car, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <CarImage src={car.images[0]} alt={`${car.brand} ${car.model}`} />
      
        <FavoriteButton 
          $isFavorite={isFavorite} 
          onClick={handleFavoriteClick}
          aria-label="Adicionar aos favoritos"
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </FavoriteButton>
      </ImageContainer>
      
      <Info>
        <Header>
          <CarTitle>{car.brand} {car.model}</CarTitle>
          <Price>{car.price}</Price>
        </Header>
        
        <Details>
          <DetailItem>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {car.year}
          </DetailItem>
          
          <DetailItem>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {car.km.toLocaleString()} km
          </DetailItem>
          
          <DetailItem>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
              <rect x="2" y="9" width="20" height="11" rx="2" ry="2"/>
            </svg>
            {car.transmission}
          </DetailItem>
          
          <DetailItem>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            {car.fuel}
          </DetailItem>
        </Details>
        
        <Actions>
          <ViewDetailsButton onClick={(e) => { e.stopPropagation(); onClick(); }}>
            Ver Detalhes
          </ViewDetailsButton>
        </Actions>
      </Info>
    </Card>
  );
}

