import styles from './Container.module.css';

// Componente principal de container para envolver outros componentes
const Container = ({ children }) => {
  return (
    <main className={styles.container}>
      {/* Renderiza os componentes filhos passados como prop */}
      {children}
    </main>
  );
};

export default Container;
