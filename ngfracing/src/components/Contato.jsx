import styled from "styled-components";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

const Section = styled.section`
  background: #111;
  color: white;
  padding: 80px 20px;
  font-family: 'Montserrat', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
`;

const Form = styled.form`
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;

  input, textarea {
    background: #222;
    color: white;
    border: none;
    padding: 12px 16px;
    margin-bottom: 1rem;
    border-radius: 6px;
    font-size: 1rem;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  button {
    background: #e70000;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background: #c80000;
    }
  }
`;

const Info = styled.div`
  flex: 1 1 400px;

  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #ffee00;
  }

  p {
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  a {
    color: white;
    text-decoration: none;

    &:hover {
      color: #fd2020;
    }
  }
`;

const Map = styled.div`
  width: 100%;
  margin-top: 2rem;

  iframe {
    width: 100%;
    height: 300px;
    border: none;
    border-radius: 8px;
  }
`;

export default function Contato() {
  return (
    <Section id="contato">
      <Container>
        <Form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Seu nome" required />
          <input type="email" placeholder="Seu e-mail" required />
          <textarea placeholder="Sua mensagem" required />
          <button type="submit">Enviar Mensagem</button>
        </Form>

        <Info>
          <h3>Fale Conosco</h3>
          <p><FaMapMarkerAlt /> Rua Exemplo, 123 - Porto Alegre, RS</p>
          <p><FaWhatsapp /> <a href="https://wa.me/5551999999999" target="_blank">WhatsApp (51) 99999-9999</a></p>
          <p><FaInstagram /> <a href="https://instagram.com/ngfracing" target="_blank">@ngfracing</a></p>
          <Map>
            <iframe 
              title="Localização NGF"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.84218229986!2d-51.175150!3d-30.034647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951978d6dd78cd7f%3A0x5bdf8d614fc199c0!2sPorto%20Alegre%2C%20RS!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Map>
        </Info>
      </Container>
    </Section>
  );
}
