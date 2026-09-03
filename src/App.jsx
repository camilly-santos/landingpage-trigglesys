// Importações diretas respeitando a estrutura de pastas em src/sections/
import { Navbar } from './sections/Navbar/Navbar';
import { Hero } from './sections/Hero/Hero';
import PainPoints from './sections/PainPoints/PainPoints';
import Methodology from './sections/Methodology/Methodology';
import { Qualifications } from './sections/About/Qualifications';
import './i18n'; // Configuração global de tradução (i18next)

function App() {
  return (
    <>
      {/* Cabeçalho fixo com a Navbar */}
      <Navbar />

      {/* Conteúdo principal - Os IDs estão dentro de cada componente */}
      <main>
        <Hero /> 
        <PainPoints />
        <Methodology />
        <Qualifications />
      </main>
    </>
  );
}

export default App;