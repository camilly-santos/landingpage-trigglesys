/**
 * Componente Qualifications (Checklist de Qualificações)
 * 
 * Seção com design de checklist estruturado exibindo certificações e garantias.
 * Estilizado via inline styles para não depender de SCSS externo.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { Award, ShieldCheck, FileCheck, Lock, Leaf } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

gsap.registerPlugin(ScrollTrigger);

// Mapeamento de ícones baseado no ID do item do JSON
const iconMap = {
  'oracle-cert': <Award size={24} color="#00A3FF" />,
  'lgpd-gdpr': <FileCheck size={24} color="#00A3FF" />,
  'iso-comp': <ShieldCheck size={24} color="#00A3FF" />,
  'zero-trust': <Lock size={24} color="#00A3FF" />,
  'finops': <Leaf size={24} color="#00A3FF" />
};

export const Qualifications = () => {
  const { t, i18n } = useTranslation();
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  const rawItems = t('qualifications.items', { returnObjects: true });
  const items = Array.isArray(rawItems) ? rawItems : [];

  useGSAP(() => {
    // Reveal suave do cabeçalho
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );

    // Efeito de "check" em cascata nos itens da lista
    const listItems = listRef.current?.querySelectorAll('.qual-item');
    if (listItems?.length) {
      gsap.fromTo(listItems,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }, { scope: sectionRef, dependencies: [i18n.language] });

  // ----------------------------------------------------------------------
  // INLINE STYLES (Mantendo o padrão do Design System sem precisar de SCSS)
  // ----------------------------------------------------------------------
  const styles = {
    section: {
      backgroundColor: '#090d16',
      padding: '6rem 0',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '900px', // Mais estreito para formato de lista/checklist
      margin: '0 auto',
      padding: '0 1.5rem',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem',
    },
    title: {
      fontSize: 'clamp(2rem, 4vw, 2.75rem)',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: '1.2',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#94a3b8',
      lineHeight: '1.6',
      maxWidth: '700px',
      margin: 0,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    card: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.5rem',
      padding: '1.5rem',
      backgroundColor: '#0a0f1c',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
    },
    iconWrapper: {
      flexShrink: 0,
      width: '56px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      backgroundColor: 'rgba(0, 163, 255, 0.08)',
      border: '1px solid rgba(0, 163, 255, 0.2)',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#F8FAFC',
      margin: 0,
      lineHeight: '1.3',
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: '#94A3B8',
      margin: 0,
      lineHeight: '1.6',
    }
  };

  return (
    <section id="qualifications" style={styles.section} ref={sectionRef}>
      <div style={styles.container}>
        
        {/* Cabeçalho */}
        <div style={styles.header} ref={titleRef}>
          <Badge variant="cyan">{t('qualifications.tag')}</Badge>
          <h2 style={styles.title}>{t('qualifications.title')}</h2>
          <p style={styles.subtitle}>{t('qualifications.subtitle')}</p>
        </div>

        {/* Checklist Estruturado */}
        <div style={styles.list} ref={listRef}>
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="qual-item"
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0d1426';
                e.currentTarget.style.borderColor = 'rgba(0, 163, 255, 0.3)';
                e.currentTarget.style.transform = 'translateX(8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0a0f1c';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={styles.iconWrapper}>
                {iconMap[item.id] || <Award size={24} color="#00A3FF" />}
              </div>
              
              <div style={styles.textContainer}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};