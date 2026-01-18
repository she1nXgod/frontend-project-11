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
  const guids = [];
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');
    const guid = item.querySelector('guid');

    guids.push(guid.textContent);

    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      guid: guid.textContent,
      id: _.uniqueId(),
    };
  });

  return { posts, feed, description, guids };
}

function getRss(state) {
  return axios
    .get(buildProxyUrl(state.form.value), { timeout: 10000 })
    .then((response) => {
      const data = response.data.contents;

      const { posts, feed, description, guids } = parseRss(data, state);
      state.posts.push(posts);
      state.feeds.push(feed);
      state.descriptions.push(description);
      guids.forEach((guid) => state.guids.add(guid));
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

        const { posts } = parseRss(data, state);
        const newPost = posts.filter(({ guid }) => !state.guids.has(guid));

        if (newPost.length > 0) {
          state.posts.push(newPost);
          newPost.forEach(({ guid }) => state.guids.add(guid));
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
