# Documentação de Estrutura e Padrões de Desenvolvimento - TriggleSys

Este documento é o guia definitivo de arquitetura do projeto. Ele mapeia a estrutura de pastas atual com os requisitos da documentação (Seções de 01 a 13) e define as regras de desenvolvimento.

---

## ⚠️ 1. REGRA DE OURO: INTERNACIONALIZAÇÃO (i18n)

**Toda vez que você for acrescentar uma escrita em algum arquivo `.jsx`, é obrigatório colocar essas escritas em seus respectivos arquivos de linguagem (`pt.json`, `en.json`, `sv.json`).** É estritamente proibido escrever textos fixos (hardcoded) diretamente nos componentes.

### Como funciona a pasta `locales/` e o arquivo `i18n.js`:
*   **`i18n.js` (Na raiz do `src/`):** É o arquivo de configuração central. Ele inicializa a biblioteca `react-i18next`, detecta o idioma do navegador do usuário e carrega os dicionários corretos. Vocês não precisam mexer nele no dia a dia, apenas saber que ele faz a mágica acontecer.
*   **`locales/`:** É a pasta onde ficam os dicionários de tradução. 
    1. Abra `src/locales/pt.json` (e depois o `en` e `sv`).
    2. Crie uma chave para o seu texto (Ex: `"hero_title": "Consultoria em Cloud"`).
    3. No seu arquivo `.jsx`, importe o hook `useTranslation` e chame o texto: `<h1>{t('hero_title')}</h1>`.

---

## 📂 2. ESTRUTURA VISUAL DE PASTAS (ARQUITETURA DO PROJETO)

Abaixo está o espelho fiel do nosso repositório. Usem este mapa para entender exatamente onde cada parte da documentação deve ser codificada.

```text
src/
├── assets/                 <-- Imagens, ícones e SVGs
├── components/
│   └── common/             <-- ♻️ COMPONENTES REUTILIZÁVEIS (Importar, não recriar)
│       ├── Badge.jsx / .scss    
│       ├── Button.jsx / .scss   
│       └── Card.jsx / .scss     
│
├── locales/                <-- 🌍 DICIONÁRIOS DE TRADUÇÃO (Obrigatório para todo texto)
│   ├── en.json
│   ├── pt.json
│   └── sv.json
│
├── sections/               <-- 🧩 COMPONENTES DE SEÇÃO (Mapeados na documentação)
│   │
│   ├── About/              <-- Seções 07, 08 e 09 (O "Guarda-chuva" de Identidade)
│   │   ├── About.jsx             <-- Container que une as Seções 07, 08 e 09
│   │   ├── About.module.scss     <-- Estilos de espaçamento do container
│   │   ├── Qualifications.jsx    <-- SEÇÃO 07: Checklist de qualificação ("Para Quem É")
│   │   ├── Differentials.jsx     <-- SEÇÃO 08: Métricas e Grid de Diferenciais
│   │   ├── Team.jsx              <-- SEÇÃO 09: Painel interativo do time (Lógica complexa)
│   │   ├── Team.module.scss      <-- Estilos EXCLUSIVOS para a complexidade do Time
│   │   └── index.jsx             <-- Exporta About.jsx 
│   │
│   ├── Cases/              <-- Seções 06 e 10 (O "Guarda-chuva" de Prova Social)
│   │   ├── Cases.jsx                 <-- Container que une as Seções 06 e 10
│   │   ├── Portfolio.jsx             <-- SEÇÃO 06: Abas dinâmicas, mockups e métricas
│   │   ├── Portfolio.module.scss     <-- Estilos exclusivos do Portfólio
│   │   ├── SocialProof.jsx           <-- SEÇÃO 10: Fita Marquee e Depoimentos
│   │   ├── SocialProof.module.scss   <-- Estilos exclusivos da Prova Social
│   │   └── index.jsx                 <-- Exporta Cases.jsx
│   │
│   ├── Compliance/         <-- SEÇÃO 11: Downloads de PDFs e Forms LGPD/Ética
│   ├── Cta/                <-- SEÇÃO 13 (Topo): Card de Conversão Final
│   ├── Footer/             <-- SEÇÃO 13 (Base): Rodapé Organizacional
│   ├── Hero/               <-- SEÇÃO 02: Card Holográfico e Botões de Ação
│   ├── Insights/           <-- SEÇÃO 12: Grid de Artigos Executivos
│   ├── Methodology/        <-- SEÇÃO 04: Linha do Tempo 4 Passos
│   ├── Navbar/             <-- SEÇÃO 01: Cabeçalho Flutuante e Seletor de Idiomas
│   ├── PainPoints/         <-- SEÇÃO 03: Cards 3D de Dores que Resolvemos
│   └── Solutions/          <-- SEÇÃO 05: Grid de Frentes de Engenharia
│
├── styles/                 <-- 🎨 ESTILOS GLOBAIS
│   ├── _mixins.scss        
│   ├── _typography.scss    
│   ├── _variables.scss     
│   └── main.scss           
│
├── App.jsx                 <-- Arquivo centralizador que importa as seções (index.jsx de cada uma)
├── i18n.js                 <-- Configuração global do sistema de idiomas
└── main.jsx                <-- Ponto de entrada do React
```

---

## 📖 3. DETALHAMENTO DA UNIÃO DE SEÇÕES COMPLEXAS (ABOUT E CASES)

Para manter o código limpo, evitamos criar arquivos gigantes. As seções que pertencem ao mesmo "domínio de negócio" foram agrupadas em pastas comuns, usando um arquivo principal para unir tudo.

### 🏢 A Pasta `About/` (Unindo Seções 07, 08 e 09)
A pasta "About" (Sobre) agrupa toda a identidade da empresa. 
*   **A Divisão:** Nós quebramos essa identidade em três arquivos menores: `Qualifications.jsx` (Seção 07 estática), `Differentials.jsx` (Seção 08 estática) e `Team.jsx` (Seção 09 dinâmica). O arquivo `Team.jsx` ganhou seu próprio arquivo SCSS (`Team.module.scss`) por possuir uma lógica complexa de abas interativas que trocam as fotos e informações dos diretores.
*   **A União:** O arquivo `About.jsx` atua **apenas como um empilhador**. Ele importa esses três componentes e os renderiza na ordem correta, aplicando um espaçamento geral através do `About.module.scss`. 

### 🏆 A Pasta `Cases/` (Unindo Seções 06 e 10)
A pasta "Cases" agrupa a prova social da empresa (o que já fizemos e quem confia em nós).
*   **A Divisão:** O arquivo `Portfolio.jsx` (Seção 06) cuida da lógica complexa do menu de filtros e troca de mockups na tela. O arquivo `SocialProof.jsx` (Seção 10) cuida exclusivamente da animação infinita das marcas (Marquee) e dos cards de depoimentos. Cada um tem seu próprio SCSS.
*   **A União:** O arquivo `Cases.jsx` junta o `<Portfolio />` e o `<SocialProof />` em um único container, e o `index.jsx` apenas exporta isso para o `App.jsx`, mantendo a raiz do projeto extremamente limpa.

