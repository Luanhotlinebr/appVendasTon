import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: boolean;
  iconRight?: boolean;
}

export function Input({ ...rest }: InputProps) {
  return <input {...rest} />;
}
