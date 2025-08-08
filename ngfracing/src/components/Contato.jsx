import styled, { keyframes } from "styled-components";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCar, FaCalculator, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import emailjs from 'emailjs-com';

// Animações
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Hero Section
const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 100%
  ),
  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23111" width="1200" height="600"/><path fill="%23222" d="M0 300L50 280C100 260 200 220 300 200C400 180 500 180 600 200C700 220 800 260 900 280C1000 300 1100 300 1150 300L1200 300V600H1150C1100 600 1000 600 900 600C800 600 700 600 600 600C500 600 400 600 300 600C200 600 100 600 50 600H0V300Z"/></svg>') center/cover;
  color: white;
  padding: 100px 20px 60px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.1) 50%, transparent 70%);
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 1s ease-out;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, #dc2626 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }
`;

// Seção Principal
const MainSection = styled.section`
  background: #111;
  color: white;
  padding: 80px 20px;
  font-family: 'Montserrat', sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

// Formulário Melhorado
const FormContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(34, 34, 34, 0.8);
  color: white;
  border: 2px solid transparent;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #dc2626;
    background: rgba(34, 34, 34, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(34, 34, 34, 0.8);
  color: white;
  border: 2px solid transparent;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #dc2626;
    background: rgba(34, 34, 34, 1);
  }

  option {
    background: #222;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(34, 34, 34, 0.8);
  color: white;
  border: 2px solid transparent;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #dc2626;
    background: rgba(34, 34, 34, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 18px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Informações de Contato
const InfoContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const InfoTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
  font-weight: 600;
`;

const ContactCards = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
`;

const ContactCard = styled.div`
  background: rgba(34, 34, 34, 0.8);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(220, 38, 38, 0.4);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
  }

  .icon {
    color: #dc2626;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #fff;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #dc2626;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(34, 34, 34, 0.8);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 38, 38, 0.2);

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  }
`;

// Seção de Diferenciais
const DifferentialsSection = styled.section`
  background: #0a0a0a;
  font-family: 'Montserrat', sans-serif;
  padding: 80px 20px;
  color: white;
`;

const DifferentialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const DifferentialsTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #dc2626;
  font-weight: 600;
`;

const DifferentialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const DifferentialCard = styled.div`
  background: rgba(34, 34, 34, 0.5);
  padding: 30px 20px;
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.8s ease-out;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(220, 38, 38, 0.4);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.1);
  }

  .icon {
    color: #dc2626;
    font-size: 2.5rem;
    margin-bottom: 15px;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: #fff;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }
`;

// Mapa
const MapSection = styled.section`
  background: #111;
  padding: 80px 20px;
  font-family: 'Montserrat', sans-serif;
`;

const MapContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const MapTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #dc2626;
  font-weight: 600;
  text-align: center;
`;

const Map = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  iframe {
    width: 100%;
    height: 400px;
    border: none;
  }
`;

// WhatsApp Flutuante
const FloatingWhatsApp = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  animation: ${pulse} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  }
`;

export default function ContatoMelhorado() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    interesse: '',
    modelo: '',
    orcamento: '',
    mensagem: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_y8thpy8',      // Copie do painel do EmailJS
      'template_wp3rfyn',     // Copie do painel do EmailJS
      formData,
      'TZ41H0DFuaLm-rj2r'          // Também chamado de Public Key
    ).then((result) => {
      console.log('Mensagem enviada:', result.text);
      alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      setFormData({ // limpa formulário
        nome: '',
        email: '',
        telefone: '',
        interesse: '',
        modelo: '',
        orcamento: '',
        mensagem: ''
      });
    }).catch((error) => {
      console.error('Erro ao enviar:', error);
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
    {/* Seção de Diferenciais */}
      <DifferentialsSection>
        <DifferentialsContainer>
          <DifferentialsTitle>Por que escolher a NGF Racing?</DifferentialsTitle>
          <DifferentialsGrid>
            <DifferentialCard>
              <FaCar className="icon" />
              <h3>Veículos com procêdencia</h3>
              <p>Seleção criteriosa de carros com procedência garantida.</p>
            </DifferentialCard>

            <DifferentialCard>
              <FaCar className="icon" />
              <h3>Qualidade máxima</h3>
              <p>Garantimos qualidade máxima no produto e no atendimento</p>
            </DifferentialCard>

            <DifferentialCard>
              <FaCar className="icon" />
              <h3>Melhor pós venda</h3>
              <p>Cuidamos de todas as etapas da negociação</p>
            </DifferentialCard>
          </DifferentialsGrid>
        </DifferentialsContainer>
      </DifferentialsSection>
      
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <h1>Entre em Contato Conosco</h1>
          <p>Sua próxima experiência automotiva começa aqui. Estamos prontos para realizar seus sonhos sobre rodas.</p>
          <CTAButton onClick={() => document.getElementById('contato').scrollIntoView({ behavior: 'smooth' })}>
            Fale Conosco Agora
          </CTAButton>
        </HeroContent>
      </HeroSection>

      {/* Seção Principal de Contato */}
      <MainSection id="contato">
        <Container>
          <FormContainer>
            <FormTitle>Envie sua Mensagem</FormTitle>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Input
                  type="email"
                  name="email"
                  placeholder="Seu melhor e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Input
                  type="tel"
                  name="telefone"
                  placeholder="WhatsApp / Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Select
                  name="interesse"
                  value={formData.interesse}
                  onChange={handleChange}
                  required
                >
                  <option value="">Tipo de interesse</option>
                  <option value="compra">Compra de veículo</option>
                  <option value="venda">Venda de veículo</option>
                  <option value="test-drive">Agendamento de test drive</option>
                  <option value="financiamento">Financiamento</option>
                  <option value="outros">Outros</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <Input
                  type="text"
                  name="modelo"
                  placeholder="Modelo de interesse (opcional)"
                  value={formData.modelo}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Select
                  name="orcamento"
                  value={formData.orcamento}
                  onChange={handleChange}
                >
                  <option value="">Faixa de orçamento (opcional)</option>
                  <option value="ate-50k">Até R$ 50.000</option>
                  <option value="50k-100k">R$ 50.000 - R$ 100.000</option>
                  <option value="100k-200k">R$ 100.000 - R$ 200.000</option>
                  <option value="acima-200k">Acima de R$ 200.000</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <TextArea
                  name="mensagem"
                  placeholder="Conte-nos mais sobre o que você precisa..."
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <SubmitButton type="submit">
                <FaEnvelope />
                Enviar Mensagem
              </SubmitButton>
            </Form>
          </FormContainer>

          <InfoContainer>
            <InfoTitle>Informações de Contato</InfoTitle>
            <ContactCards>
              <ContactCard>
                <FaMapMarkerAlt className="icon" />
                <h3>Endereço</h3>
                <p>Rua Exemplo, 123<br />Porto Alegre, RS - CEP 90000-000</p>
              </ContactCard>

              <ContactCard>
                <FaPhone className="icon" />
                <h3>Telefone</h3>
                <p><a href="tel:+5551999866578">(51) 99986-6578</a></p>
              </ContactCard>

              <ContactCard>
                <FaEnvelope className="icon" />
                <h3>E-mail</h3>
                <p><a href="mailto:contato@ngfracing.com">ngfracing@hotmail.com</a></p>
              </ContactCard>

              <ContactCard>
                <FaClock className="icon" />
                <h3>Horário de Funcionamento</h3>
                <p>Segunda a Sexta: 8h às 18h<br />Sábado: 9h às 15h</p>
              </ContactCard>
            </ContactCards>

            <SocialLinks>
              <SocialLink href="https://wa.me/5551999866578" target="_blank" title="WhatsApp">
                <FaWhatsapp />
              </SocialLink>
              <SocialLink href="https://instagram.com/ngfracing" target="_blank" title="Instagram">
                <FaInstagram />
              </SocialLink>
            </SocialLinks>
          </InfoContainer>
        </Container>
      </MainSection>

      

      {/* Seção do Mapa 
      <MapSection>
        <MapContainer>
          <MapTitle>Nossa Localização</MapTitle>
          <Map>
            <iframe 
              title="Localização NGF Racing"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.84218229986!2d-51.175150!3d-30.034647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951978d6dd78cd7f%3A0x5bdf8d614fc199c0!2sPorto%20Alegre%2C%20RS!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Map>
        </MapContainer>
      </MapSection>*/}

      {/* WhatsApp Flutuante */}
      <FloatingWhatsApp href="https://wa.me/5551999999999" target="_blank" title="Fale conosco no WhatsApp">
        <FaWhatsapp />
      </FloatingWhatsApp>
    </>
  );
}

