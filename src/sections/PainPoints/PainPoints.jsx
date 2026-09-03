/**
 * Componente PainPoints — "Dores que Resolvemos"
 * 
 * ─── SOLUÇÃO DA TRADUÇÃO (React vs SplitText) ─────────────────────────────
 * O uso da propriedade `key={i18n.language}` no <h2> força o React a destruir
 * o elemento antigo e montar um novo sempre que o idioma muda. Isso impede
 * que as mutações de DOM feitas pelo SplitText bloqueiem a atualização do 
 * texto traduzido pelo i18next. Tudo pode voltar a rodar de forma limpa 
 * dentro de um único useGSAP!
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, ShieldAlert, Cpu, Users, RefreshCw, Lock } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import styles from './PainPoints.module.scss';

// Registra todos os plugins usados
gsap.registerPlugin(ScrollTrigger, InertiaPlugin, SplitText);

const iconMap = {
  'cloud-cost':      <TrendingDown size={28} />,
  'security-risk':   <ShieldAlert  size={28} />,
  'rigid-systems':   <Cpu          size={28} />,
  'unaligned-teams': <Users        size={28} />,
  'no-dr-plan':      <RefreshCw    size={28} />,
  'cloud-lockin':    <Lock         size={28} />,
};

const PainPoints = () => {
  const { t, i18n } = useTranslation();

  // Refs do DOM
  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef     = useRef(null);

  const rawCards = t('painPoints.cards', { returnObjects: true });
  const cards    = Array.isArray(rawCards) ? rawCards : [];

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMAÇÕES UNIFICADAS (useGSAP)
  // ═══════════════════════════════════════════════════════════════════════
  useGSAP(() => {
    
    // ── 1. REVEAL DO TÍTULO COM SPLITTEXT ─────────────────────────────────
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, {
        type: 'chars,words',
        linesClass: styles.splitLine,
      });

      gsap.set(split.chars, {
        opacity: 0,
        y: 22,
        filter: 'blur(8px)',
        willChange: 'transform, opacity, filter',
      });

      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.025,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 82%',
          end:   'bottom 45%',
          scrub: 1.2,
        },
      });
    }

    // ── 2. FADE DO SUBTÍTULO ──────────────────────────────────────────────
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ── 3. CASCATA DE CARDS ───────────────────────────────────────────────
    const cardElements = gridRef.current?.querySelectorAll(`.${styles.card}`);
    if (cardElements?.length) {
      gsap.fromTo(
        cardElements,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: { each: 0.12, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      
      // ── 4. TILT 3D COM INERTIA ──────────────────────────────────────────
      const MAX_TILT = 12;
      const listeners = [];

      cardElements.forEach((card) => {
        InertiaPlugin.track(card, 'rotateX,rotateY');

        const handleMouseMove = (e) => {
          const rect    = card.getBoundingClientRect();
          const centerX = rect.left + rect.width  / 2;
          const centerY = rect.top  + rect.height / 2;
          const normX   = (e.clientX - centerX) / (rect.width  / 2);
          const normY   = (e.clientY - centerY) / (rect.height / 2);

          gsap.set(card, {
            rotateX:              -normY * MAX_TILT,
            rotateY:               normX * MAX_TILT,
            transformPerspective:  900,
            transformOrigin:      'center center',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            inertia: {
              rotateX: { velocity: 'auto', end: 0 },
              rotateY: { velocity: 'auto', end: 0 },
            },
          });
        };

        card.addEventListener('mousemove',  handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        listeners.push({ card, handleMouseMove, handleMouseLeave });
      });

      // Cleanup dos listeners
      return () => {
        listeners.forEach(({ card, handleMouseMove, handleMouseLeave }) => {
          card.removeEventListener('mousemove',  handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
          InertiaPlugin.untrack(card);
        });
      };
    }

  }, { 
    scope: sectionRef, 
    dependencies: [i18n.language], // Refaz animações quando a língua muda
    revertOnUpdate: true           // Limpa o lixo da animação anterior automaticamente
  });

  // ═══════════════════════════════════════════════════════════════════════
  // RENDERIZAÇÃO
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <section className={styles.painPointsSection} id="dores" ref={sectionRef}>
      <div className={styles.container}>

        <header className={styles.header}>
          <Badge>{t('painPoints.tag')}</Badge>

          {/* O SEGREDO: key={i18n.language} força o React a recriar esta tag do zero */}
          <h2 key={`title-${i18n.language}`} className={styles.title} ref={titleRef}>
            {t('painPoints.title')}
          </h2>

          <p key={`subtitle-${i18n.language}`} className={styles.subtitle} ref={subtitleRef}>
            {t('painPoints.subtitle')}
          </p>
        </header>

        <div className={styles.grid} ref={gridRef}>
          {cards.map((card) => (
            <div key={card.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                {iconMap[card.id] || <Cpu size={28} />}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PainPoints;