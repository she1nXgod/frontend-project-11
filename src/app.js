import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import { loadTranslations, renderFeedback } from './ui.js';

export default () => {
  const state = {
    form: {
      value: null,
      status: 'pending', // 'sending', 'success',
      error: '',
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const schema = yup.string().url().required();

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    common: {
      title: document.querySelector('h1'),
      description: document.querySelector('.lead'),
      inputLabel: document.querySelector('label'),
      linkExample: document.querySelector('.text-secondary'),
      submitAddBtn: document.querySelector('[aria-label="add"]'),
      modalFullArticleBtn: document.querySelector('.full-article'),
      modalCloseBtn: document.querySelector('button[class="btn btn-secondary"]'),
    },
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const value = formData.get('url').trim();

    schema
      .validate(value, { abortEarly: false })
      .then(() => {
        if (state.form.value === value) {
          state.form.error = 'repeatedURL';
          renderFeedback(state, elements, i18nInstance);
          return;
        }
        state.form.status = 'sending';
        state.form.error = '';
        renderFeedback(state, elements, i18nInstance);
      })
      .catch(() => {
        state.form.error = 'invalidURL';
        state.form.status = 'pending';
        renderFeedback(state, elements, i18nInstance);
      })
      .finally(() => {
        state.form.value = value;
      });
  });

  loadTranslations(elements, i18nInstance);
};
