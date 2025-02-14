import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>,
  name: FieldPath<T>,
  label: string,
  placeholder: string
}

const CustomInput = <T extends FieldValues>({ 
  control, 
  name, 
  label, 
  placeholder 
}: CustomInputProps<T>) => {
  const inputId = `${name}-input`;
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel htmlFor={inputId} className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input 
                id={inputId}
                placeholder={placeholder}
                className="input-class"
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput