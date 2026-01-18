import _ from 'lodash';
import axios from 'axios';
import { renderPosts } from './ui.js';

function buildProxyUrl(url) {
  return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
}

function parseRss(data) {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');

  const feed = parsedData.querySelector('title').textContent;
  const description = parsedData.querySelector('description').textContent;
  const items = parsedData.querySelectorAll('item');

  if (feed === 'Error') {
    throw new Error('invalidRSS');
  }

  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');
    const guid = item.querySelector('guid');

    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      guid: guid.textContent,
      id: _.uniqueId(),
    };
  });

  return { posts, feed, description };
}

function getRss(state) {
  return axios
    .get(buildProxyUrl(state.form.value), { timeout: 10000 })
    .then((response) => {
      const data = response.data.contents;

      const { posts, feed, description } = parseRss(data);
      state.posts.push(posts);
      state.feeds.push(feed);
      state.descriptions.push(description);
    })
    .catch((error) => {
      if (error.message === 'invalidRSS') {
        throw error;
      }
      console.error(error);
      throw new Error('networkError');
    });
}

function rssPostsUpdate(state, elements, i18n, url, timeout = 5000) {
  function tick() {
    axios
      .get(buildProxyUrl(url), { timeout: 10000 })
      .then((response) => {
        const data = response.data.contents;

        const { posts } = parseRss(data);
        const guids = state.posts.flat().map(({ guid }) => guid);
        const newPost = Object.values(posts).filter(({ guid }) => !guids.includes(guid));

        if (newPost.length > 0) {
          state.posts.push(newPost);
          renderPosts(state, elements, i18n);
        }
      })
      .catch((err) => {
        console.error('RSS update error:', err);
      })
      .finally(() => {
        setTimeout(tick, timeout);
      });
  }

  tick();
}

export { getRss, rssPostsUpdate };
