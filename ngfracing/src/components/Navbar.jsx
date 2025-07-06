import { useState } from 'react';
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
    display: none;
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
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #e70000;
  }
`;

const Button = styled.a`
  font-family: 'Orbitron', sans-serif;
  background-color: #e70000;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background-color: #c80000;
  }
`;

// ---------- Mobile Styles ----------

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;

  span {
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  @media (min-width: 769px) {
    display: none;
  }

  background-color: #111;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  padding: 2rem;
  display: ${({ open }) => (open ? 'block' : 'none')};

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    a {
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      text-decoration: none;

      &:hover {
        color: #e70000;
      }
    }
  }

  a.button {
    display: inline-block;
    width: 100%;
    text-align: center;
    background-color: #e70000;
    color: #fff;
    padding: 0.8rem;
    border-radius: 8px;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      background-color: #c80000;
    }
  }
`;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Header>
      <Container>
        <Logo src={logoImg} alt="NGF Racing" />
        <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>

        <Nav>
          <NavList>
            <NavItem><NavLink href="#home">Início</NavLink></NavItem>
            <NavItem><NavLink href="#estoque">Estoque</NavLink></NavItem>
            <NavItem><NavLink href="#sobre">Sobre</NavLink></NavItem>
            <NavItem><NavLink href="#contato">Contato</NavLink></NavItem>
          </NavList>
          <Button href="#contato">Solicitar Orçamento</Button>
        </Nav>

        <MobileMenu open={menuOpen}>
          <ul>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Início</a></li>
            <li><a href="#estoque" onClick={() => setMenuOpen(false)}>Estoque</a></li>
            <li><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a></li>
            <li><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></li>
          </ul>
          <a href="#contato" className="button" onClick={() => setMenuOpen(false)}>Solicitar Orçamento</a>
        </MobileMenu>
      </Container>
    </Header>
  );
}

export default Navbar;
