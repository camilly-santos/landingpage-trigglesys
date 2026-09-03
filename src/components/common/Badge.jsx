import styles from './Badge.module.scss';

// Componente visual para exibir pequenas tags, status e destaques no layout.
export function Badge({ children, variant = 'cyan', icon: Icon, className = '' }) {
  return (
    // Aplica o tema de cor selecionado combinando as classes dinamicamente.
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {/* Renderiza o ícone à esquerda do texto quando fornecido via prop. */}
      {Icon && <Icon className={styles.icon} size={14} />}
      <span>{children}</span>
    </span>
  );
}