import React from 'react';

const InputField = ({ label, error, ...inputProps }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputField;

