import styled from 'styled-components';
import { useState } from 'react';
import CarCard from './CarCard';
import CarModal from './CarModal';
import cars from '../data/cars';

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: auto;
  margin-top: 4rem;
`;

export default function Estoque() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Grid id="estoque">
        {cars.map(car => (
          <CarCard key={car.id} car={car} onClick={() => setSelected(car)} />
        ))}
      </Grid>
      {selected && <CarModal car={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
