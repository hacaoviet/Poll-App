import React, { useState } from 'react';
import {
  FormContainer,
  Form,
  FormGroup,
  Label,
  Input,
  OptionsContainer,
  OptionInput,
  OptionField,
  RemoveButton,
  AddButton,
  SubmitButton,
  InfoText,
  ErrorMessage,
  TransactionErrorMessage
} from '../styles/CreatePollStyles';

const CreatePoll = ({ onCreatePoll, loading }) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [errors, setErrors] = useState({});
  const [transactionError, setTransactionError] = useState('');

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Poll title is required';
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map(option => option.toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      newErrors.options = 'Options must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Clear any previous transaction errors
      setTransactionError('');

      const validOptions = options.filter(option => option.trim() !== '');
      await onCreatePoll(title.trim(), validOptions);
      
      // Reset form after successful creation
      setTitle('');
      setOptions(['', '']);
      setErrors({});
    } catch (error) {
      // Handle user rejection
      if (error.code === 'ACTION_REJECTED') {
        setTransactionError('Transaction was cancelled. Please try again to create your poll.');
      } else {
        setTransactionError(
          'Failed to create poll: ' + 
          (error.reason || 'Please check your wallet and try again.')
        );
      }
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setTransactionError('');
      }, 5000);
    }
  };

  return (
    <FormContainer>
      <h2>Create New Poll</h2>
      {(errors.title || errors.options) && (
        <ErrorMessage>
          {errors.title && <div>{errors.title}</div>}
          {errors.options && <div>{errors.options}</div>}
        </ErrorMessage>
      )}
      
      {transactionError && (
        <TransactionErrorMessage>
          {transactionError}
        </TransactionErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Poll Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter poll title..."
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <Label>Poll Options</Label>
          <OptionsContainer>
            {options.map((option, index) => (
              <OptionInput key={index}>
                <OptionField
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}...`}
                  maxLength={50}
                />
                {options.length > 2 && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </RemoveButton>
                )}
              </OptionInput>
            ))}
          </OptionsContainer>
          {options.length < 10 && (
            <AddButton type="button" onClick={addOption}>
              + Add Option
            </AddButton>
          )}
          <InfoText>
            Minimum 2 options, maximum 10 options. All options must be unique.
          </InfoText>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default CreatePoll; 