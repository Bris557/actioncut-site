export type FormTopic = 'beta' | 'feedback';

export type FormValues = {
  topic: FormTopic;
  name: string;
  email: string;
  phone: string;
  sport: string;
  message: string;
  /** Honeypot: hidden from people; Formspree drops a submission that fills it. */
  gotcha: string;
};

export type FormErrors = Partial<Record<'email' | 'message', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const email = values.email.trim();
  if (!email) errors.email = 'Enter your email so we can reply.';
  else if (!EMAIL.test(email)) errors.email = 'That email doesn’t look right.';
  if (values.topic === 'feedback' && !values.message.trim()) errors.message = 'Tell us what’s on your mind.';
  return errors;
}

/** What goes to Formspree: trimmed, empty fields left out; feedback carries no phone details. */
export function formPayload(values: FormValues): Record<string, string> {
  const fields =
    values.topic === 'beta'
      ? {name: values.name, email: values.email, phone: values.phone, sport: values.sport, message: values.message}
      : {name: values.name, email: values.email, message: values.message};
  const payload: Record<string, string> = {topic: values.topic};
  for (const [key, value] of Object.entries(fields)) {
    const trimmed = value.trim();
    if (trimmed) payload[key] = trimmed;
  }
  payload._gotcha = values.gotcha;
  return payload;
}
