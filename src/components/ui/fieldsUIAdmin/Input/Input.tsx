import type { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    value?: string | number;
};

export default function Input({ value, className = '', ...props }: Props) {
    return <input {...props} className={classNames('form-control', className)} value={value ?? ''} />;
}
