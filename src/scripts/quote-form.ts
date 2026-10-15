import {
  parseQuoteForm,
  projectTypeFromQuery,
  type QuoteFieldErrors,
} from '../lib/contracts/quote';
import { isBotSubmission, submitQuote, VISIBLE_FIELDS } from '../lib/quote-submit';

/**
 * Progressive enhancement for the quote form: preselects the project type from `?type=`,
 * validates with the shared schema, shows inline accessible errors and reports the outcome.
 * With no PUBLIC_FORM_ENDPOINT it runs in demo mode and says clearly that nothing is sent.
 */
const form = document.querySelector<HTMLFormElement>('[data-quote-form]');

const DONE_TITLES = {
  demo: 'Your request looks good, but this preview does not send it.',
  sent: 'Thanks, we have your request.',
} as const;

function preselectProjectType(target: HTMLFormElement): void {
  const select = target.querySelector<HTMLSelectElement>('[data-project-type]');
  const type = projectTypeFromQuery(new URLSearchParams(location.search).get('type'));
  if (select && type) select.value = type;
}

function setup(target: HTMLFormElement): void {
  const status = target.querySelector<HTMLElement>('[data-form-status]');
  const submit = target.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = target.querySelector<HTMLElement>('[data-submit-label]');
  const done = document.querySelector<HTMLElement>('[data-form-done]');
  const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT || undefined;
  const idleLabel = submitLabel?.textContent ?? '';

  // The submit button ships hidden and disabled: without this script the form cannot send.
  if (submit) {
    submit.hidden = false;
    submit.disabled = false;
  }

  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };

  /** Writes each field's message (or clears it); returns the first invalid control. */
  const showErrors = (errors: QuoteFieldErrors): HTMLElement | undefined => {
    let firstInvalid: HTMLElement | undefined;
    for (const name of VISIBLE_FIELDS) {
      const control = target.elements.namedItem(name);
      const holder = target.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (!(control instanceof HTMLElement) || !holder) continue;
      const message = errors[name];
      holder.textContent = message ?? '';
      holder.hidden = !message;
      if (message) {
        control.setAttribute('aria-invalid', 'true');
        firstInvalid ??= control;
      } else {
        control.removeAttribute('aria-invalid');
      }
    }
    return firstInvalid;
  };

  const setBusy = (isBusy: boolean) => {
    if (!submit) return;
    submit.disabled = isBusy;
    submit.toggleAttribute('data-loading', isBusy);
    if (submitLabel) submitLabel.textContent = isBusy ? 'Sending…' : idleLabel;
  };

  const showDone = (mode: 'demo' | 'sent') => {
    target.hidden = true;
    if (!done) return;
    done.querySelector<HTMLElement>('[data-done-demo]')?.toggleAttribute('hidden', mode !== 'demo');
    done.querySelector<HTMLElement>('[data-done-live]')?.toggleAttribute('hidden', mode !== 'sent');
    const title = done.querySelector<HTMLElement>('[data-done-title]');
    if (title) title.textContent = DONE_TITLES[mode];
    done.hidden = false;
    done.focus();
  };

  // A field's error clears as soon as the visitor edits it.
  target.addEventListener('input', (event) => {
    const control = event.target;
    if (!(
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement
    ))
      return;
    const holder = target.querySelector<HTMLElement>(`[data-error-for="${control.name}"]`);
    if (!holder || holder.hidden) return;
    holder.hidden = true;
    holder.textContent = '';
    control.removeAttribute('aria-invalid');
  });

  target.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(target);

    const parsed = parseQuoteForm(data);
    // Bots fill the hidden field (the schema's honeypot rule): pretend success (the demo note in
    // demo mode, never a fake "sent"), send nothing.
    if (!parsed.ok && isBotSubmission(parsed.errors)) {
      showDone(endpoint ? 'sent' : 'demo');
      return;
    }
    if (!parsed.ok) {
      const count = Object.keys(parsed.errors).length;
      setStatus(
        `Please fix ${count === 1 ? 'the highlighted field' : `${count} highlighted fields`} and send again.`,
      );
      showErrors(parsed.errors)?.focus();
      return;
    }

    showErrors({});
    setBusy(true);
    setStatus(endpoint ? 'Sending your request.' : '');
    const outcome = await submitQuote(parsed.data, endpoint);
    setBusy(false);

    switch (outcome.kind) {
      case 'demo':
      case 'sent':
        setStatus('');
        showDone(outcome.kind);
        return;
      case 'rejected':
        setStatus('Some details need another look. Please check the highlighted fields.');
        showErrors(outcome.errors)?.focus();
        return;
      case 'failed':
        setStatus('Your request did not go through. Please try again, or call or text us instead.');
    }
  });
}

if (form) {
  form.noValidate = true;
  preselectProjectType(form);
  setup(form);
}
