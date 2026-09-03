import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.scss";

// ----------------------------------------------------------------------
// CONFIGURAÇÃO DOS LINKS DO MENU
// "Metodologia" removida. "Soluções & Engenharia" mantida.
// ----------------------------------------------------------------------
const NAV_ITEMS = [
  { id: "home", labelKey: "nav.home", defaultLabel: "Início" },
  { id: "dores", labelKey: "nav.painPoints", defaultLabel: "Dores que Resolvemos" },
  { id: "solucoes", labelKey: "nav.solutions", defaultLabel: "Soluções & Engenharia" },
  { id: "projetos", labelKey: "nav.projects", defaultLabel: "Projetos" },
  { id: "quem-somos", labelKey: "nav.about", defaultLabel: "Quem Somos" },
  { id: "compliance", labelKey: "nav.compliance", defaultLabel: "Compliance" },
  { id: "insights", labelKey: "nav.insights", defaultLabel: "Insights" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const headerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "pt";

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Efeito 1: Fundo dinâmico no scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito 2: Destacar o link ativo no scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ----------------------------------------------------------------------
  // FUNÇÃO DE ROLAGEM SUAVE NATIVA
  // ----------------------------------------------------------------------
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const cleanId = targetId.replace("#", "");
    setActiveSection(cleanId);

    const targetElement = document.getElementById(cleanId);

    if (targetElement) {
      const headerOffset = 85; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      console.warn(`⚠️ Seção com ID "${cleanId}" não foi encontrada na página.`);
    }
  };

  const isLinkActive = (itemId) => {
    return activeSection === itemId;
  };

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={`container ${styles.headerContainer}`}>
        
        {/* LOGO */}
        <a 
          href="#home" 
          onClick={(e) => handleScrollTo(e, "#home")} 
          className={styles.brand}
        >
          <span className={styles.brandTriggle}>Triggle</span>
          <span className={styles.brandSys}>Sys</span>
        </a>

        {/* MENU DESKTOP (Estrutura mantida para não quebrar o layout) */}
        <div className={styles.navPill}>
          <nav className={styles.navMenu}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, `#${item.id}`)}
                className={`${styles.navLink} ${isLinkActive(item.id) ? styles.active : ""}`}
              >
                {t(item.labelKey, item.defaultLabel)}
              </a>
            ))}
          </nav>
        </div>

        {/* IDIOMAS E MENU MOBILE */}
        <div className={styles.rightActions}>
          <div className={styles.langSelector}>
            <button
              type="button"
              className={`${styles.langBtn} ${currentLang.startsWith("pt") ? styles.activeLang : ""}`}
              onClick={() => handleLanguageChange("pt")}
            >
              <img src="https://flagcdn.com/w40/br.png" alt="PT" className={styles.flagIcon} />
              <span>PT</span>
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${currentLang.startsWith("en") ? styles.activeLang : ""}`}
              onClick={() => handleLanguageChange("en")}
            >
              <img src="https://flagcdn.com/w40/us.png" alt="EN" className={styles.flagIcon} />
              <span>EN</span>
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${currentLang.startsWith("sv") ? styles.activeLang : ""}`}
              onClick={() => handleLanguageChange("sv")}
            >
              <img src="https://flagcdn.com/w40/se.png" alt="SV" className={styles.flagIcon} />
              <span>SV</span>
            </button>
          </div>

          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNav}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, `#${item.id}`)}
              >
                {t(item.labelKey, item.defaultLabel)}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}