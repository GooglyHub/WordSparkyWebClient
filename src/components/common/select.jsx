import React from 'react';

const Select = ({
    name,
    label,
    options,
    nameField,
    error,
    includeBlank,
    ...rest
}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select {...rest} id={name} name={name} className="form-control">
                {includeBlank && <option value="" />}
                {options.map((option) => (
                    <option key={option._id || option.value} value={option._id}>
                        {option[nameField]}
                    </option>
                ))}
            </select>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Select;
