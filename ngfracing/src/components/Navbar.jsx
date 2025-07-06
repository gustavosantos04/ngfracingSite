import styled from 'styled-components';
import logoImg from '../assets/www.ngfracing.com.br-logo.jpg';

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #111;
  padding: 1rem 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Logo = styled.img`
  height: 50px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none; /* Substituir por menu mobile depois */
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li``;

const NavLink = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #e70000;
  }
`;

const Button = styled.a`
  font-family: 'Orbitron', sans-serif;
  background-color: #e70000;
  color: #ffff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background-color: #c80000;
  }
`;

function Navbar() {
  return (
    <Header>
      <Container>
        <Logo src={logoImg} alt="NGF Racing" />
        <Nav>
          <NavList>
            <NavItem><NavLink href="#home">Início</NavLink></NavItem>
            <NavItem><NavLink href="#estoque">Estoque</NavLink></NavItem>
            <NavItem><NavLink href="#sobre">Sobre</NavLink></NavItem>
            <NavItem><NavLink href="#contato">Contato</NavLink></NavItem>
          </NavList>
          <Button href="#contato">Solicitar Orçamento</Button>
        </Nav>
      </Container>
    </Header>
  );
}

export default Navbar;
