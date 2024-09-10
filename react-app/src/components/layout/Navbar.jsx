import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import Logo from '../../assets/images/logo.png';

/* Contexto do usuário */
import { Context } from '../../context/UserContext';

// Componente de barra de navegação
const Navbar = () => {
  const { authenticated, logout } = useContext(Context);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <img src={Logo} alt="Patas Unidas" />
        <h2>Patas Unidas</h2>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <li>
              <Link to="/pet/myadoptions">Minhas Adoções</Link>
            </li>
            <li>
              <Link to="/pet/mypets">Meus Pets</Link>
            </li>
            <li>
              <Link to="/user/profile">Meu Perfil</Link>
            </li>
            <li onClick={logout}>Sair</li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Registrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
