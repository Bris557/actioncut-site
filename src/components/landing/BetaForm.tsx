import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useId, useState, type ChangeEvent, type FormEvent} from 'react';
import {site} from '@site/src/data/site';
import {formPayload, validateForm, type FormErrors, type FormTopic, type FormValues} from '@site/src/lib/feedbackForm';
import Icon from '../brand/Icon';
import Button from '../ui/Button';
import styles from './BetaForm.module.css';

const EMPTY: FormValues = {topic: 'beta', email: '', phone: '', android: '', sport: '', message: '', gotcha: ''};
const TOPICS: {id: FormTopic; label: string}[] = [
  {id: 'beta', label: 'Join the beta'},
  {id: 'feedback', label: 'Send feedback'},
];

type Status = 'idle' | 'sending' | 'sent' | 'failed';

/** Beta sign-up and feedback, posted to Formspree — the site itself stays static. */
export default function BetaForm() {
  const id = useId();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');

  const set = (key: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setValues((v) => ({...v, [key]: value}));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus('sending');
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(formPayload(values)),
      });
      if (res.ok) {
        setStatus('sent');
        return;
      }
      const body = (await res.json().catch(() => null)) as {errors?: {message?: string}[]} | null;
      setFailure(body?.errors?.[0]?.message ?? '');
      setStatus('failed');
    } catch {
      setFailure('');
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <div className={clsx(styles.card, styles.done)} role="status">
        <span className={styles.doneMark}>
          <Icon name="check" size={28} strokeWidth={2.6} />
        </span>
        <h3 className={styles.doneTitle}>{values.topic === 'beta' ? 'You’re on the list!' : 'Thanks for the feedback!'}</h3>
        <p className={styles.doneBody}>
          {values.topic === 'beta'
            ? `We’ll email ${values.email.trim()} with a link to the test version.`
            : `We read every message and reply to ${values.email.trim()} if there’s something to answer.`}
        </p>
        <Button
          variant="tonal"
          onClick={() => {
            setValues({...EMPTY, topic: values.topic});
            setStatus('idle');
          }}>
          Send another
        </Button>
      </div>
    );
  }

  const beta = values.topic === 'beta';
  const field = (key: 'phone' | 'android' | 'sport', label: string, placeholder: string) => (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} name={key} value={values[key]} onChange={set(key)} placeholder={placeholder} maxLength={100} />
    </label>
  );

  return (
    <form className={styles.card} onSubmit={submit} noValidate aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="ac-sr-only">
        Beta sign-up and feedback
      </h3>
      <div className={styles.toggle} role="group" aria-label="What would you like to do?">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={values.topic === t.id}
            className={clsx(styles.segment, values.topic === t.id && styles.segmentOn)}
            onClick={() => {
              setValues((v) => ({...v, topic: t.id}));
              setErrors({});
            }}>
            {values.topic === t.id && <Icon name="check" size={16} strokeWidth={2.8} />}
            {t.label}
          </button>
        ))}
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          placeholder="you@example.com"
          maxLength={200}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
        />
        {errors.email && (
          <span id={`${id}-email-error`} className={styles.error}>
            {errors.email}
          </span>
        )}
      </label>

      {beta && (
        <div className={styles.row}>
          {field('phone', 'Phone model', 'e.g. Pixel 8')}
          {field('android', 'Android version', 'e.g. 15')}
          {field('sport', 'Sport you film', 'e.g. Hockey')}
        </div>
      )}

      <label className={styles.field}>
        <span className={styles.label}>{beta ? 'Anything else? (optional)' : 'Your feedback'}</span>
        <textarea
          className={clsx(styles.input, styles.textarea)}
          name="message"
          value={values.message}
          onChange={set('message')}
          placeholder={beta ? 'Teams, tournaments, questions…' : 'What works, what doesn’t, what you wish it did'}
          maxLength={3000}
          rows={beta ? 3 : 5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
        />
        {errors.message && (
          <span id={`${id}-message-error`} className={styles.error}>
            {errors.message}
          </span>
        )}
      </label>

      {/* Honeypot: invisible to people, filled in by bots. */}
      <input
        className={styles.honeypot}
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        value={values.gotcha}
        onChange={set('gotcha')}
        aria-hidden="true"
      />

      <div className={styles.actions}>
        <Button submit disabled={status === 'sending'} size="l" icon={<Icon name="mail" />}>
          {status === 'sending' ? 'Sending…' : beta ? 'Request the beta' : 'Send feedback'}
        </Button>
        <span className={styles.note}>
          We only use your email to reply. <Link to="/privacy">Privacy</Link>
        </span>
      </div>
      <p className={styles.status} role="alert">
        {status === 'failed' &&
          `Couldn’t send${failure ? `: ${failure}` : ''}. Try again, or email us at ${site.contactEmail ?? ''}.`}
      </p>
    </form>
  );
}
