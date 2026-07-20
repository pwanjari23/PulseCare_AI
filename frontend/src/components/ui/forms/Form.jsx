import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { RadioGroup } from './RadioGroup';
import { Switch } from './Switch';

// UTILITY TO EXTRACT ERROR FROM FORM STATE
const getFieldError = (errors, name) => {
  if (!errors || !name) return null;
  const parts = name.split('.');
  let current = errors;
  for (const part of parts) {
    if (!current) return null;
    current = current[part];
  }
  return current?.message || null;
};

// FORM INPUT WRAPPER
export const FormInput = ({ name, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <Input
      {...register(name)}
      error={error}
      {...props}
    />
  );
};
FormInput.displayName = 'FormInput';

// FORM SELECT WRAPPER
export const FormSelect = ({ name, ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          error={error}
          {...props}
        />
      )}
    />
  );
};
FormSelect.displayName = 'FormSelect';

// FORM CHECKBOX WRAPPER
export const FormCheckbox = ({ name, ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <Checkbox
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          error={error}
          {...field}
          {...props}
        />
      )}
    />
  );
};
FormCheckbox.displayName = 'FormCheckbox';

// FORM SWITCH WRAPPER
export const FormSwitch = ({ name, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <Switch
          checked={!!value}
          onChange={onChange}
          {...field}
          {...props}
        />
      )}
    />
  );
};
FormSwitch.displayName = 'FormSwitch';

// FORM RADIO GROUP WRAPPER
export const FormRadioGroup = ({ name, children, ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <RadioGroup
          value={value}
          onChange={onChange}
          error={error}
          {...field}
          {...props}
        >
          {children}
        </RadioGroup>
      )}
    />
  );
};
FormRadioGroup.displayName = 'FormRadioGroup';
