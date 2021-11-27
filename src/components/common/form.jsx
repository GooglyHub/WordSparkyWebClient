import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import Select from './select';

class Form extends Component {
    state = {
        data: {},
        errors: {},
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) {
            return null;
        }
        const errors = {};
        for (let item of error.details) {
            errors[item.path[0]] = item.message;
        }
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) {
            return;
        }
        this.doSubmit();
    };

    handleChange = ({ currentTarget: input }, changeCallback) => {
        const data = { ...this.state.data };
        const errors = { ...this.state.errors };

        let val = input.value;
        if (changeCallback) {
            // Allow the callback to change the value
            val = changeCallback(val);
            if (val === null) {
                // canceled
                input.value = this.state.data[input.name];
                return;
            }
        }

        const errorMessage = this.validateProperty(input);
        if (errorMessage) {
            errors[input.name] = errorMessage;
        } else {
            delete errors[input.name];
        }
        data[input.name] = val;
        this.setState({ data, errors });
    };

    renderButton(label) {
        return (
            <button disabled={this.validate()} className="btn btn-warning">
                {label}
            </button>
        );
    }

    renderInput(name, label, type = 'text', readOnly = false) {
        const { data, errors } = this.state;
        return (
            <Input
                name={name}
                value={data[name]}
                label={label}
                type={type}
                readOnly={readOnly}
                error={errors[name]}
                onChange={this.handleChange}
            ></Input>
        );
    }

    renderSelect(
        name,
        label,
        options,
        nameField,
        includeBlank = true,
        changeCallback = null
    ) {
        const { data, errors } = this.state;
        return (
            <Select
                name={name}
                value={data[name]}
                label={label}
                options={options}
                nameField={nameField}
                error={errors[name]}
                includeBlank={includeBlank}
                onChange={(currentTarget) => {
                    this.handleChange(currentTarget, changeCallback);
                }}
            />
        );
    }
}

export default Form;
