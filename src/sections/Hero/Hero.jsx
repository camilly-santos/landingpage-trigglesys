/**
 * Componente Hero
 *
 * Seção principal (topo) da página inicial.
 * Apresenta a proposta de valor da empresa com animações avançadas.
 * Dependências principais: GSAP (animações), React-i18next (tradução) e Lucide (ícones).
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Zap, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import heroImg from '../../assets/hero.png';
import styles from './Hero.module.scss';

// Registra os plugins do GSAP necessários para as animações de scroll e integração com React
gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  // ----------------------------------------------------------------------
  // REFERÊNCIAS (REFS)
  // Utilizadas pelo GSAP para manipular os elementos do DOM diretamente
  // ----------------------------------------------------------------------
  const containerRef = useRef(null); // Container principal da seção
  const bgImgRef     = useRef(null); // Imagem de fundo (parallax)
  const titleRef     = useRef(null); // Título principal (animação de "respiração")
  const badgeRef     = useRef(null); // Badge superior (entrada + parallax)

  const { t } = useTranslation();

  // ----------------------------------------------------------------------
  // ANIMAÇÕES (GSAP)
  // ----------------------------------------------------------------------
  useGSAP(() => {
    // 1. ANIMAÇÕES DE CARREGAMENTO INICIAL
    gsap.from('.hero-bg-anim', { autoAlpha: 0, duration: 2, ease: 'power2.inOut' });
    gsap.from(badgeRef.current, { y: 20, autoAlpha: 0, duration: 0.6, delay: 0.5, ease: 'power3.out' });

    // 2. TIMELINE DE TEXTO (ScrollTrigger com pin)
    const tlText = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: 'top top',
        end: '+=500',
        scrub: 1,
      },
    });
    tlText
      .from('.text-anim', { y: 50, autoAlpha: 0, stagger: 0.1 })
      .from('.subtitle-anim', { y: 30, autoAlpha: 0 }, '-=0.2');

    // 3. TIMELINE DE BOTÕES E MICRO-BADGES
    const tlButtons = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        toggleActions: 'play none none reverse',
      },
    });
    tlButtons
      .from('.fade-up-anim', { y: 30, autoAlpha: 0, stagger: 0.15, delay: 0.8 })
      .from('.micro-badge-anim', { y: 20, autoAlpha: 0, stagger: 0.1 }, '-=0.2');

    // 4. EFEITO DE "RESPIRAÇÃO" NO TÍTULO (loop infinito)
    gsap.to(titleRef.current, {
      scale: 1.02,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 5. PARALLAX INTERATIVO (Mouse Move)
    const xToBg    = gsap.quickTo(bgImgRef.current, 'x', { duration: 1.2, ease: 'power2.out' });
    const yToBg    = gsap.quickTo(bgImgRef.current, 'y', { duration: 1.2, ease: 'power2.out' });
    const xToBadge = gsap.quickTo(badgeRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
    const yToBadge = gsap.quickTo(badgeRef.current, 'y', { duration: 0.8, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const moveX = e.clientX / window.innerWidth  - 0.5;
      const moveY = e.clientY / window.innerHeight - 0.5;
      xToBg(moveX * 35);
      yToBg(moveY * 35);
      xToBadge(moveX * -15);
      yToBadge(moveY * -15);
    };

    const container = containerRef.current;
    if (container) container.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

  // ----------------------------------------------------------------------
  // DADOS DOS MICRO-BADGES
  // ----------------------------------------------------------------------
  const microBadgesKeys = [
    'hero.microBadges.zeroTrust',
    'hero.microBadges.uml',
    'hero.microBadges.lgpd',
    'hero.microBadges.iso',
    'hero.microBadges.oracle',
  ];

  return (
    <section id="home" className={styles.heroSection} ref={containerRef}>

      {/* CAMADA DE FUNDO */}
      <div className={`hero-bg-anim ${styles.heroBackground}`}>
        <img ref={bgImgRef} src={heroImg} alt="" />
        <div className={styles.overlay} />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="container position-relative z-2 h-100">
        <div className="row align-items-center justify-content-center h-100 text-center">
          <div className="col-12 col-lg-10 pt-5 mt-5">
            <div className={styles.textContent}>

              {/* BADGE DE DESTAQUE */}
              <div ref={badgeRef} className="mx-auto mb-4" style={{ willChange: 'transform' }}>
                <Badge variant="cyan" icon={Zap}>
                  {t('hero.badge')}
                </Badge>
              </div>

              {/* TÍTULO */}
              <h1 ref={titleRef} className={styles.title}>
                <span className="text-anim d-inline-block">{t('hero.title.part1')}</span>{' '}
                <span className={`text-anim d-inline-block ${styles.textGradientCyan}`}>{t('hero.title.cloud')}</span>{' '}
                <span className={`text-anim d-inline-block ${styles.textGradientCyan}`}>{t('hero.title.security')}</span>{' '}
                <span className="text-anim d-inline-block">{t('hero.title.and')}</span>{' '}
                <span className={`text-anim d-inline-block ${styles.textGradientPurple}`}>{t('hero.title.governance')}</span>
                <br className="d-none d-md-block" />
                <span className="text-anim d-inline-block mt-2">{t('hero.title.part2')}</span>{' '}
                <span className={`text-anim d-inline-block mt-2 ${styles.highlightText}`}>{t('hero.title.architecture')}</span>
              </h1>

              {/* SUBTÍTULO */}
              <p className={`subtitle-anim ${styles.subtitle} mx-auto`}>
                {t('hero.subtitle')}
              </p>

              {/* BOTÕES */}
              <div className={`actions-container ${styles.actions} justify-content-center`}>
                <button className={`fade-up-anim ${styles.btnPrimaryPremium}`}>
                  {t('hero.actions.schedule')}
                  <ArrowRight size={18} />
                </button>
                <button className={`fade-up-anim ${styles.btnSecondaryPremium}`}>
                  <MessageSquare size={18} />
                  {t('hero.actions.talk')}
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                * MICRO-BADGES ATUALIZADOS
                *
                * Estrutura de cada badge:
                *   .microBadge          → card escuro com rounded corners
                *   .microBadge::after   → glow azul na borda inferior
                *                          (pseudo-elemento para não afetar layout)
                *   .microBadgeIcon      → círculo com ícone azul
                *   .microBadgeLabel     → texto branco legível
                ──────────────────────────────────────────────────────────── */}
              <div className={styles.microBadgesContainer}>
                {microBadgesKeys.map((key, idx) => (
                  <div key={idx} className={`micro-badge-anim ${styles.microBadge}`}>
                    <span className={styles.microBadgeIcon}>
                      <CheckCircle2 size={14} />
                    </span>
                    <span className={styles.microBadgeLabel}>{t(key)}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}