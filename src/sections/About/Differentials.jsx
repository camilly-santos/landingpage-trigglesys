/**
 * Componente Differentials
 * 
 * Painel estatístico de métricas e diferenciais competitivos.
 * Utiliza o GSAP para animar a contagem dos números (counter) durante o scroll.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import styles from './Differentials.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Differentials = () => {
  const { t, i18n } = useTranslation();

  // Refs do DOM
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  const rawStats = t('differentials.stats', { returnObjects: true });
  const stats = Array.isArray(rawStats) ? rawStats : [];

  useGSAP(() => {
    // 1. Reveal do título com SplitText
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, {
        type: 'chars,words',
        linesClass: styles.splitLine,
      });

      gsap.set(split.chars, { opacity: 0, y: 22, filter: 'blur(8px)' });

      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          end: 'bottom 50%',
          scrub: 1.2,
        },
      });
    }

    // 2. Fade do subtítulo
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

    // 3. Animação dos Cards e Contagem dos Números
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(`.${styles.statCard}`);
      const numbers = gridRef.current.querySelectorAll(`.${styles.statValueNumeric}`);

      // Cascata dos cards subindo
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Efeito de Count-up para os números
      numbers.forEach((numElement) => {
        const endValue = parseFloat(numElement.getAttribute('data-value')) || 0;
        
        if (endValue > 0) {
          gsap.fromTo(
            numElement,
            { innerText: 0 },
            {
              innerText: endValue,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 }, // Arredonda para números inteiros
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }

  }, { 
    scope: sectionRef, 
    dependencies: [i18n.language],
    revertOnUpdate: true 
  });

  return (
    <section className={styles.differentialsSection} id="differentials" ref={sectionRef}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <Badge variant="cyan">{t('differentials.tag')}</Badge>

          <h2 key={`title-${i18n.language}`} className={styles.title} ref={titleRef}>
            {t('differentials.title')}
          </h2>

          <p key={`subtitle-${i18n.language}`} className={styles.subtitle} ref={subtitleRef}>
            {t('differentials.subtitle')}
          </p>
        </header>

        <div className={styles.statsGrid} ref={gridRef}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.statCard}>
              
              {/* Box do Valor Numérico/Texto */}
              <div className={styles.valueBox}>
                {stat.prefix && <span className={styles.statPrefix}>{stat.prefix}</span>}
                {stat.value && (
                  <span 
                    className={styles.statValueNumeric} 
                    data-value={stat.value}
                  >
                    {stat.value}
                  </span>
                )}
                {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
              </div>

              {/* Informações */}
              <h3 className={styles.statLabel}>{stat.label}</h3>
              <p className={styles.statDescription}>{stat.description}</p>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Differentials;