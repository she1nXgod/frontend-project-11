import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import { loadTranslations, renderFeedback, renderRssContent } from './ui.js';
import { getRss, rssPostsUpdate } from './rss.js';

export default () => {
  const state = {
    form: {
      value: null,
      error: '',
    },
    urls: [],
    posts: [],
    feeds: [],
    descriptions: [],
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const schema = yup.string().url('invalidURL').required('required');

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
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

    state.form.value = value;

    schema
      .validate(state.form.value, { abortEarly: false })
      .then(() => {
        elements.common.submitAddBtn.disabled = true;

        if (state.urls.includes(state.form.value)) {
          state.form.error = 'repeatedURL';
          renderFeedback(state, elements, i18nInstance);
          throw new Error('repeatedURL');
        }
        return getRss(state);
      })
      .then(() => {
        state.urls.push(state.form.value);
        state.form.error = '';
        renderFeedback(state, elements, i18nInstance);
        renderRssContent(state, elements, i18nInstance);

        const lastUrl = state.urls.at(-1);
        rssPostsUpdate(state, elements, i18nInstance, lastUrl, 5000);
      })
      .catch((error) => {
        console.error('err: ', error);
        state.form.error = error.message;
        renderFeedback(state, elements, i18nInstance);
      })
      .finally(() => {
        elements.common.submitAddBtn.disabled = false;
      });
  });

  loadTranslations(elements, i18nInstance);
};
