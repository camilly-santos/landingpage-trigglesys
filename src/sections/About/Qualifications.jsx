/**
 * Componente Qualifications
 * 
 * Checklist estruturado de qualificações e certificações corporativas.
 * Usa um layout de grid com cards horizontais para simular um checklist premium.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { Shield, FileCheck, Award, Lock, Leaf, Network } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import styles from './Qualifications.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Mapa de ícones específicos para cada qualificação
const iconMap = {
  'iso': <Shield size={26} />,
  'lgpd': <FileCheck size={26} />,
  'oracle': <Award size={26} />,
  'zerotrust': <Lock size={26} />,
  'finops': <Leaf size={26} />,
  'uml': <Network size={26} />,
};

const Qualifications = () => {
  const { t, i18n } = useTranslation();

  // Refs do DOM
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  const rawItems = t('qualifications.items', { returnObjects: true });
  const items = Array.isArray(rawItems) ? rawItems : [];

  useGSAP(() => {
    // 1. Reveal do título com SplitText
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

    // 3. Animação de entrada dos itens do checklist (Stagger)
    if (gridRef.current) {
      const checkItems = gridRef.current.querySelectorAll(`.${styles.checkItem}`);
      
      gsap.fromTo(
        checkItems,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

  }, { 
    scope: sectionRef, 
    dependencies: [i18n.language],
    revertOnUpdate: true 
  });

  return (
    <section className={styles.qualificationsSection} id="qualifications" ref={sectionRef}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <Badge variant="purple">{t('qualifications.tag')}</Badge>

          <h2 key={`title-${i18n.language}`} className={styles.title} ref={titleRef}>
            {t('qualifications.title')}
          </h2>

          <p key={`subtitle-${i18n.language}`} className={styles.subtitle} ref={subtitleRef}>
            {t('qualifications.subtitle')}
          </p>
        </header>

        <div className={styles.checklistGrid} ref={gridRef}>
          {items.map((item) => (
            <div key={item.id} className={styles.checkItem}>
              
              <div className={styles.iconBox}>
                {iconMap[item.id] || <Award size={26} />}
                {/* Efeito de brilho que acende no hover */}
                <div className={styles.iconGlow}></div>
              </div>

              <div className={styles.textContent}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Qualifications;