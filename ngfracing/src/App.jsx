import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sobre from './components/Sobre';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Hero />
        <Sobre />
      </main>
    </>
  );
}

export default App;
