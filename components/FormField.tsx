import React from 'react'

const FormField = ({id, label, type="text", placeholder, value, onChange, as = "input", options = []}:FormFieldProps) => {
  return (
    <div className='form-field' >
      <label htmlFor={id} >{label}</label>
          { as==='textarea'?
            (<textarea 
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />) : as === 'select' ? (
            <select 
                id={id}
                name={id}
                value={value}
                onChange={onChange}
            >
                {options.map(({label, value})=>(
                  <option key={label} value={value} >{label}</option>
                ))}
            </select>
        ) : (<input 
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}

             />
          )}
    </div>
  )
}

export default FormField
