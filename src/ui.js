function loadTranslations(elements, i18n) {
  Object.entries(elements.common).forEach(([key, element]) => {
    element.textContent = i18n.t(key);
  });
}

function renderFeedback(state, elements, i18n) {
  if (state.form.error.length > 0) {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.classList.remove('text-success');
    elements.feedback.textContent = i18n.t(`feedback.errors.${state.form.error}`);
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.add('text-success');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.textContent = i18n.t('feedback.success');

    elements.input.value = '';
    elements.input.focus();
  }
}

export { loadTranslations, renderFeedback };
