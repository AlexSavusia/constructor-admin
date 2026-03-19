import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type BaseProps = {
    title?: string;
    className?: string;
    children: ReactNode;
};

type ButtonProps = BaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: 'button';
    };

type AnchorProps = BaseProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        as: 'a';
    };

type Props = ButtonProps | AnchorProps;

export function IconBtn(props: Props) {
    if (props.as === 'a') {
        const { children, className, title, ...rest } = props;
        return (
            <a
                {...rest}
                className={className}
                title={title}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {children}
            </a>
        );
    }

    const { children, className, title, ...rest } = props;
    return (
        <button
            {...rest}
            type={rest.type ?? 'button'}
            className={className}
            title={title}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {children}
        </button>
    );
}
