"use client";

import { createContext, use } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Label, hint and error around one control (planning/DESIGN.md §7.3). Controls inside it get
 * `id`, `aria-describedby`, `aria-invalid` and `required` automatically; hint and error ids are
 * `<htmlFor>-hint` and `<htmlFor>-error`.
 */
export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext value={{ id: htmlFor, describedBy, invalid: Boolean(error), required }}>
      <div className="flex flex-col gap-2">
        <label htmlFor={htmlFor} className="text-body-sm font-medium text-ink">
          {label}
          {required && (
            <span aria-hidden className="text-accent-text">
              {" "}
              *
            </span>
          )}
        </label>
        {hint && (
          <p id={hintId} className="text-body-sm text-ink-muted">
            {hint}
          </p>
        )}
        {children}
        {error && (
          <p id={errorId} className="flex items-start gap-2 text-body-sm text-danger">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  );
}

const controlClasses =
  "w-full rounded-sm border border-line-strong bg-surface text-body text-ink placeholder:text-ink-subtle transition-[border-color] duration-150 hover:border-ink-muted aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60";

function useFieldProps(props: {
  id?: string;
  required?: boolean;
  invalid?: boolean;
  "aria-describedby"?: string;
}) {
  const field = use(FieldContext);
  const invalid = props.invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    required: props.required ?? field?.required,
    "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
    "aria-invalid": invalid || undefined,
  };
}

export function Input({ invalid, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const field = useFieldProps({ ...props, invalid });
  return <input {...props} {...field} className={cn(controlClasses, "h-12 px-4", className)} />;
}

export function Textarea({
  invalid,
  className,
  rows = 5,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  const field = useFieldProps({ ...props, invalid });
  return <textarea rows={rows} {...props} {...field} className={cn(controlClasses, "min-h-32 resize-y px-4 py-3", className)} />;
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  const field = useFieldProps({ ...props, invalid });
  return (
    <div className={cn("relative", className)}>
      <select {...props} {...field} className={cn(controlClasses, "h-12 appearance-none pr-11 pl-4")}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}

export function Checkbox({
  label,
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; invalid?: boolean }) {
  const field = useFieldProps({ ...props, invalid });
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-body-sm text-ink", className)}>
      <input
        type="checkbox"
        {...props}
        {...field}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-sm border-line-strong accent-(--accent) aria-invalid:outline-2 aria-invalid:outline-danger"
      />
      <span>{label}</span>
    </label>
  );
}
