import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import {
  loadTranslations,
  renderFeedback,
  renderPosts,
  renderRssContent,
  renderReadAsPost,
  renderModal,
} from './ui.js';
import { getRss, rssPostsUpdate } from './rss.js';

export default () => {
  const state = {
    form: {
      value: null,
      error: '',
    },
    guids: new Set(),
    urls: new Set(),
    posts: [],
    readPostsId: new Set(),
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
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalBtnFullArticle: document.querySelector('.full-article'),
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

  elements.posts.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.closest('a[data-id]');
    const button = target.closest('button[data-id]');

    if (link) {
      const postId = link.dataset.id;

      if (!state.readPostsId.has(postId)) {
        state.readPostsId.add(postId);
        renderReadAsPost(elements, postId);
      }
    }

    if (button) {
      const postId = button.dataset.id;

      if (!state.readPostsId.has(postId)) {
        state.readPostsId.add(postId);
        renderReadAsPost(elements, postId);
      }

      renderModal(state, elements, postId);
    }
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const value = formData.get('url').trim();

    state.form.value = value;

    schema
      .validate(state.form.value, { abortEarly: false })
      .then(() => {
        elements.common.submitAddBtn.disabled = true;

        if (state.urls.has(state.form.value)) {
          state.form.error = 'repeatedURL';
          renderFeedback(state, elements, i18nInstance);
          throw new Error('repeatedURL');
        }
        return getRss(state);
      })
      .then(() => {
        state.urls.add(state.form.value);
        state.form.error = '';
        renderFeedback(state, elements, i18nInstance);
        renderRssContent(state, elements, i18nInstance);

        const lastUrl = Array.from(state.urls).at(-1);
        rssPostsUpdate(state, lastUrl, 5000, () => renderPosts(state, elements, i18nInstance));
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
