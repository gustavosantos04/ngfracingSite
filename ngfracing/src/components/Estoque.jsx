import styled from 'styled-components';
import { useState, useMemo } from 'react';
import CarCard from './CarCard';
import CarModal from './CarModal';
import cars from '../data/cars';

const EstoqueContainer = styled.section`
  background: #0a0a0a;
  min-height: 100vh;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    color: #ffffff;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.2rem;
    font-family: 'Montserrat', sans-serif;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  .contador {
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    color: #dc2626;
    font-weight: 600;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

console.log('Carros carregados:', cars);

export default function EstoqueMelhorado() {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <EstoqueContainer id="estoque">
      <Container>
        <Header>
          <h1>Nosso Estoque</h1>
          <p>Carros com procedência e qualidade garantida</p>
          <div className="contador">{cars.length} veículos disponíveis</div>
        </Header>

        {/* Grid que envolve os cards */}
        <Grid>
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onClick={() => setSelectedCar(car)}
            />
          ))}
        </Grid>

        {/* Modal com os detalhes do carro selecionado */}
        {selectedCar && (
          <CarModal
            car={selectedCar}
            onClose={() => setSelectedCar(null)}
          />
        )}
      </Container>
    </EstoqueContainer>
  );
}
