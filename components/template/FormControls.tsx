export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`appoint-input ${props.className ?? ""}`.trim()} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`appoint-input ${props.className ?? ""}`.trim()} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`appoint-input ${props.className ?? ""}`.trim()} />;
}

