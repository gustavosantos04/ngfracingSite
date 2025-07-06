import styled from 'styled-components';

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s;
  &:hover { transform: translateY(-5px); }
`;

const Img = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 1rem;
  color: white;
  h3 { font-family: 'Orbitron'; margin: 0; font-size:1.2rem; }
  p { font-size: .9rem; margin:.3rem 0; }
  .price { font-size:1.3rem; font-weight:bold; color:#fd2020; }
`;

export default function CarCard({ car, onClick }) {
  return (
    <Card onClick={onClick}>
      <Img src={car.images[0]} alt={car.model} />
      <Info>
        <h3>{car.brand} {car.model}</h3>
        <p>{car.year} • {car.km} km • {car.transmission}</p>
        <div className="price">{car.price}</div>
      </Info>
    </Card>
  );
}
