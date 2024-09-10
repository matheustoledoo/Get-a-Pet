import styles from './Select.module.css';

// Componente de seleção que renderiza um rótulo e um campo de seleção
const SelectBox = ({ label, name, options, onChange, selectedValue }) => {
  return (
    // Container para o controle de formulário
    <div className={styles.formControl}>
      {/* Rótulo para o campo de seleção */}
      <label htmlFor={name}>{label}:</label>
      {/* Campo de seleção com as opções fornecidas */}
      <select
        name={name}
        id={name}
        onChange={onChange}
        value={selectedValue || ''}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
