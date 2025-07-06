import { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Content = styled.div`
  padding: 20px;
  color: #111;
  font-family: 'Montserrat', sans-serif;

  h2 {
    font-family: 'Orbitron';
    color: #e70000;
    margin-top: 1.5rem;
  }

  ul {
    padding-left: 20px;
    margin-top: 1rem;
  }

  button {
    margin-top: 1.5rem;
    background: #e70000;
    color: #fff;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background: #c00000;
    }
  }
`;

Modal.setAppElement('#root');

export default function CarModal({ car, onClose }) {
  const sliderRef = useRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  // Força reposicionamento quando abrir
  useEffect(() => {
    if (sliderRef.current) {
      setTimeout(() => {
        sliderRef.current.slickGoTo(0);
      }, 300); // tempo ideal para evitar flickering
    }
  }, [car]);

  return (
    <Modal
      isOpen={!!car}
      onRequestClose={onClose}
      contentLabel="Detalhes do carro"
      style={{
        content: {
          maxWidth: "800px",
          margin: "auto",
          borderRadius: "10px",
          inset: "50px",
          zIndex: 9999,
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.75)",
          zIndex: 9998,
        },
      }}
    >
      <Content>
        <Slider ref={sliderRef} {...settings}>
          {car.images.map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt={`Foto ${i + 1} de ${car.model}`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          ))}
        </Slider>
        <h2>{car.brand} {car.model}</h2>
        <p>{car.year} • {car.km} km • {car.fuel} • {car.transmission}</p>
        <ul>
          {car.options.map((op, i) => (
            <li key={i}>{op}</li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </Content>
    </Modal>
  );
}
