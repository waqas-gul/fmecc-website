export function VisuallyHidden({ as: Tag = "span", children }: { as?: "span" | "div"; children: React.ReactNode }) {
  return <Tag className="sr-only">{children}</Tag>;
}
