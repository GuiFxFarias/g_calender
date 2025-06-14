import { forwardRef } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';
import { Input } from '@/components/ui/input';
import { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'>;

type FormattedInputProps = {
  format?: string;
} & Omit<PatternFormatProps<InputProps>, 'format' | 'customInput'> &
  InputProps;

export const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ format, ...props }, ref) => {
    if (!format) {
      return <Input ref={ref} {...props} />;
    }

    return (
      <PatternFormat
        {...props}
        getInputRef={ref}
        format={format}
        allowEmptyFormatting
        mask='_'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customInput={Input as any}
      />
    );
  }
);

FormattedInput.displayName = 'FormattedInput';
