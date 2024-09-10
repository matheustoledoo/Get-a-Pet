import React, { useEffect, useState } from 'react';
import bus from '../../utils/bus';
import styles from './Message.module.css';

// Componente para exibir mensagens de feedback ao usuário
const Message = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // Adiciona um listener para exibir mensagens de flash
    bus.addListener('flash', ({ message, type }) => {
      setIsVisible(true);
      setMessageContent(message);
      setMessageType(type);
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    });
  }, []);

  useEffect(() => {
    // Adiciona um listener para fechar a mensagem quando o botão de fechar for clicado
    const closeButton = document.querySelector('.close');
    if (closeButton) {
      closeButton.addEventListener('click', () => setIsVisible(false));
    }
  });

  return (
    isVisible && (
      <div className={`${styles.message} ${styles[messageType]}`}>
        {messageContent}
      </div>
    )
  );
};

export default Message;
