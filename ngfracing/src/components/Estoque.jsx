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
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  .contador {
    font-size: 1rem;
    color: #dc2626;
    font-weight: 600;
  }
`;

const ControlesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const OrdenacaoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  background: #1f1f1f;
  color: #ffffff;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #dc2626;
  }
  
  option {
    background: #1f1f1f;
    color: #ffffff;
  }
`;

const ResultadosInfo = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SemResultados = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  button {
    background: #dc2626;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:hover {
      background: #b91c1c;
    }
  }
`;

export default function EstoqueMelhorado() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [filtros, setFiltros] = useState({
    busca: '',
    marca: '',
    precoMin: 0,
    precoMax: 1000000,
    anoMin: 2010,
    anoMax: 2025,
    kmMax: 200000,
    combustivel: [],
    cambio: []
  });
  const [ordenacao, setOrdenacao] = useState('mais-recentes');

  // Função para filtrar carros
  const carrosFiltrados = useMemo(() => {
    let resultado = cars.filter(car => {
      // Filtro de busca
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase();
        const texto = `${car.brand} ${car.model}`.toLowerCase();
        if (!texto.includes(busca)) return false;
      }

      // Filtro de marca
      if (filtros.marca && car.brand !== filtros.marca) return false;

      // Filtro de preço (convertendo string para número)
      const preco = parseInt(car.price.replace(/[^\d]/g, ''));
      if (preco < filtros.precoMin || preco > filtros.precoMax) return false;

      // Filtro de ano
      if (car.year < filtros.anoMin || car.year > filtros.anoMax) return false;

      // Filtro de quilometragem
      if (car.km > filtros.kmMax) return false;

      // Filtro de combustível
      if (filtros.combustivel.length > 0 && !filtros.combustivel.includes(car.fuel)) return false;

      // Filtro de câmbio
      if (filtros.cambio.length > 0 && !filtros.cambio.includes(car.transmission)) return false;

      return true;
    });

    // Aplicar ordenação
    switch (ordenacao) {
      case 'menor-preco':
        resultado.sort((a, b) => {
          const precoA = parseInt(a.price.replace(/[^\d]/g, ''));
          const precoB = parseInt(b.price.replace(/[^\d]/g, ''));
          return precoA - precoB;
        });
        break;
      case 'maior-preco':
        resultado.sort((a, b) => {
          const precoA = parseInt(a.price.replace(/[^\d]/g, ''));
          const precoB = parseInt(b.price.replace(/[^\d]/g, ''));
          return precoB - precoA;
        });
        break;
      case 'menor-km':
        resultado.sort((a, b) => a.km - b.km);
        break;
      case 'mais-novo':
        resultado.sort((a, b) => b.year - a.year);
        break;
      default:
        // mais-recentes (ordem original)
        break;
    }

    return resultado;
  }, [filtros, ordenacao]);

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      marca: '',
      precoMin: 0,
      precoMax: 1000000,
      anoMin: 2010,
      anoMax: 2025,
      kmMax: 200000,
      combustivel: [],
      cambio: []
    });
  };

  return (
    <EstoqueContainer id="estoque">
      <Container>
        <Header>
          <h1>Nosso Estoque</h1>
          <p>Carros com procedência e qualidade garantida</p>
          <div className="contador">{carrosFiltrados.length} veículos disponíveis</div>
        </Header>

        {carrosFiltrados.length > 0 ? (
          <Grid>
            {carrosFiltrados.map(car => (
              <CarCard
                key={car.id} 
                car={car} 
                onClick={() => setSelectedCar(car)} 
              />
            ))}
          </Grid>
        ) : (
          <SemResultados>
            <h3>Nenhum veículo encontrado</h3>
            <p>Tente ajustar os filtros para encontrar o carro ideal para você.</p>
            <button onClick={limparFiltros}>Limpar Filtros</button>
          </SemResultados>
        )}

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

