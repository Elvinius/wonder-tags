import React from 'react';
const FormErrors = ({ formErrors }) =>
  <div className='formErrors'>
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        return (
          <small key={i}>Error: {formErrors[fieldName]}</small>
        )
      } else {
        return '';
      }
    })}
  </div>

export default FormErrors;