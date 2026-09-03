/**
 * Componente Methodology
 * 
 * Linha do tempo interativa representando os 4 passos da metodologia de engenharia.
 * Utiliza GSAP ScrollTrigger para desenhar a linha do tempo e revelar os cards.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { Activity, ShieldCheck, Zap, GraduationCap } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import styles from './Methodology.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

const iconMap = {
  'step-1': <Activity size={24} />,
  'step-2': <ShieldCheck size={24} />,
  'step-3': <Zap size={24} />,
  'step-4': <GraduationCap size={24} />,
};

const Methodology = () => {
  const { t, i18n } = useTranslation();

  // Refs do DOM
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  const rawSteps = t('methodology.steps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];

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
        stagger: 0.025,
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

    // 3. Animação da Timeline (Linha Central/Lateral e Cards)
    if (timelineRef.current && lineRef.current) {
      const stepItems = timelineRef.current.querySelectorAll(`.${styles.stepItem}`);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 1, // Faz a linha desenhar conforme o scroll
        }
      });

      // Anima a altura da linha progressivamente
      tl.fromTo(lineRef.current, 
        { scaleY: 0 }, 
        { scaleY: 1, ease: 'none', transformOrigin: 'top center' }
      );

      // Anima os cards surgindo em cascata (independente do scrub da linha)
      gsap.fromTo(
        stepItems,
        { x: -50, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

  }, {
    scope: sectionRef,
    dependencies: [i18n.language],
    revertOnUpdate: true
  });

  return (
    <section className={styles.methodologySection} id="methodology" ref={sectionRef}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <Badge variant="cyan">{t('methodology.tag')}</Badge>

          <h2 key={`title-${i18n.language}`} className={styles.title} ref={titleRef}>
            {t('methodology.title')}
          </h2>

          <p key={`subtitle-${i18n.language}`} className={styles.subtitle} ref={subtitleRef}>
            {t('methodology.subtitle')}
          </p>
        </header>

        <div className={styles.timelineWrapper} ref={timelineRef}>
          {/* Linha vertical animada pelo GSAP */}
          <div className={styles.timelineLineWrapper}>
             <div className={styles.timelineLine} ref={lineRef}></div>
          </div>

          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.stepItem}>
                
                {/* Node da timeline (bolinha com ícone) */}
                <div className={styles.stepNode}>
                  <div className={styles.nodeIcon}>
                    {iconMap[step.id]}
                  </div>
                  {/* Conector brilhante animado no CSS */}
                  <div className={styles.nodeGlow}></div>
                </div>

                {/* Conteúdo do Card */}
                <div className={styles.stepCard}>
                  <h3 className={styles.stepTitle}>
                    <span className={styles.stepNumber}>0{index + 1}</span>
                    {step.title.replace(/^[0-9]\.\s/, '')}
                  </h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Methodology;