import styles from './Card.module.scss';

// Componente visual reutilizável com estética glassmorphism e variantes de estado.
export function Card({
  children,
  variant = 'default',
  hoverEffect = true,
  className = '',
  ...props
}) {
  // Consolidação das classes CSS de acordo com a variante e efeitos informados.
  const cardClasses = [
    styles.card,
    styles[variant],
    hoverEffect ? styles.hoverable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {/* Camada interna para garantir a hierarquia correta de z-index do conteúdo. */}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
}