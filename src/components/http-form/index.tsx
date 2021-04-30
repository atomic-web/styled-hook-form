import useAxios from 'axios-hooks';
import { FormBuilder } from 'components/form-builder';
import React from 'react';
import { HttpFormProps } from './types';

const HttpForm : React.FC<HttpFormProps> = (props)=>{
    
    let {fields} = props;
    
    
    const handleSubmit = ()=>{
        
    };

    useAxios

    return <FormBuilder fields={fields} onSubmit={handleSubmit}>

    </FormBuilder>
}

export default HttpForm;