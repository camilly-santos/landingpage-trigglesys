import styles from './Button.module.scss';

// Botão reutilizável para padronizar as ações principais e secundárias da aplicação.
export function Button({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Exibe o ícone à esquerda quando especificado em iconPosition. */}
      {Icon && iconPosition === 'left' && <Icon className={styles.icon} size={18} />}
      <span>{children}</span>
      {/* Mantém o ícone à direita por padrão para indicar continuidade ou ação. */}
      {Icon && iconPosition === 'right' && <Icon className={styles.icon} size={18} />}
    </button>
  );
}