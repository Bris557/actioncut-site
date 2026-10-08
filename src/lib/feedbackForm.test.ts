import {describe, expect, it} from 'vitest';
import {formPayload, validateForm, type FormValues} from './feedbackForm';

const beta: FormValues = {
  topic: 'beta',
  name: ' Anna ',
  email: ' parent@example.com ',
  phone: 'Pixel 8',
  sport: 'Hockey',
  message: '',
  gotcha: '',
};

describe('validateForm', () => {
  it('accepts a beta request without a message', () => {
    expect(validateForm(beta)).toEqual({});
  });

  it('asks for an email, and for a real-looking one', () => {
    expect(validateForm({...beta, email: '  '})).toEqual({email: 'Enter your email so we can reply.'});
    expect(validateForm({...beta, email: 'parent@'})).toEqual({email: 'That email doesn’t look right.'});
  });

  it('needs a message for feedback', () => {
    expect(validateForm({...beta, topic: 'feedback', message: ' '})).toEqual({message: 'Tell us what’s on your mind.'});
    expect(validateForm({...beta, topic: 'feedback', message: 'Love it'})).toEqual({});
  });
});

describe('formPayload', () => {
  it('leaves the name out when it is empty', () => {
    expect(formPayload({...beta, name: '  '})).not.toHaveProperty('name');
  });

  it('trims values and leaves out empty fields', () => {
    expect(formPayload(beta)).toEqual({
      topic: 'beta',
      name: 'Anna',
      email: 'parent@example.com',
      phone: 'Pixel 8',
      sport: 'Hockey',
      _gotcha: '',
    });
  });

  it('sends only the name, email and message for feedback', () => {
    expect(formPayload({...beta, topic: 'feedback', message: ' Great app '})).toEqual({
      topic: 'feedback',
      name: 'Anna',
      email: 'parent@example.com',
      message: 'Great app',
      _gotcha: '',
    });
  });
});
