import { useState } from 'react';

// Hook for form validation with Zod-like API
const useZodForm = (schema, defaultValues = {}) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update field value
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validate = () => {
    try {
      if (schema && schema.parse) {
        schema.parse(values);
        setErrors({});
        return true;
      }
      return true;
    } catch (error) {
      const fieldErrors = {};
      
      if (error.errors) {
        error.errors.forEach(err => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      
      setErrors(fieldErrors);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      const isValid = validate();
      
      if (isValid) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const reset = () => {
    setValues(defaultValues);
    setErrors({});
    setIsSubmitting(false);
  };

  // Get error for field
  const getError = (name) => errors[name];

  // Check if field has error
  const hasError = (name) => Boolean(errors[name]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    validate,
    handleSubmit,
    reset,
    getError,
    hasError,
    register: (name) => ({
      value: values[name] || '',
      onChange: (e) => setValue(name, e.target.value),
      error: getError(name),
    }),
  };
};

export default useZodForm;
