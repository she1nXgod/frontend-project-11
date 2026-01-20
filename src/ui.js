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

function renderRssLayout(elements, i18n, feedsOrPosts) {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const listGroup = document.createElement('ul');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title', 'h4');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  listGroup.id = `list-group-${feedsOrPosts}`;

  cardTitle.textContent = i18n.t(`${feedsOrPosts}CardTitle`);

  card.append(cardBody, listGroup);
  cardBody.append(cardTitle);

  elements[feedsOrPosts].append(card);
}

function renderFeeds(state, elements, i18n) {
  if (elements.feeds.childNodes.length === 0) {
    renderRssLayout(elements, i18n, 'feeds');
  }

  const listGroupFeeds = document.getElementById('list-group-feeds');

  const listGroupItem = document.createElement('li');
  const listItemName = document.createElement('h3');
  const listItemDescription = document.createElement('p');

  listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
  listItemName.classList.add('h6', 'm-0');
  listItemDescription.classList.add('m-0', 'small', 'text-black-50');

  listItemName.textContent = state.feeds.at(-1);
  listItemDescription.textContent = state.descriptions.at(-1);

  listGroupItem.append(listItemName, listItemDescription);
  listGroupFeeds.prepend(listGroupItem);
}

function renderPosts(state, elements, i18n) {
  if (elements.posts.childNodes.length === 0) {
    renderRssLayout(elements, i18n, 'posts');
  }
  const listGroupPosts = document.getElementById('list-group-posts');

  state.posts.at(-1).forEach(({ title, link, id }) => {
    const listGroupItem = document.createElement('li');
    const listItemLink = document.createElement('a');
    const listItemButton = document.createElement('button');

    listGroupItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    listItemLink.classList.add('fw-bold');
    listItemButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    listItemLink.href = link;
    listItemLink.dataset.id = id;
    listItemLink.target = '_blank';
    listItemLink.rel = 'noopener noreferrer';

    listItemButton.type = 'button';
    listItemButton.dataset.id = id;
    listItemButton.dataset.bsToggle = 'modal';
    listItemButton.dataset.bsTarget = '#modal';

    listItemLink.textContent = title;
    listItemButton.textContent = i18n.t('postsCardBtn');

    listItemLink.addEventListener('click', (event) => {
      const target = event.target;
      target.classList.remove('fw-bold');
      target.classList.add('fw-normal', 'link-secondary');
    });

    listGroupItem.append(listItemLink, listItemButton);
    listGroupPosts.prepend(listGroupItem);
  });
}

function renderRssContent(state, elements, i18n) {
  renderFeeds(state, elements, i18n);
  renderPosts(state, elements, i18n);
}

function renderReadAsPost(elements, postId) {
  const link = elements.posts.querySelector(`a[data-id="${postId}"]`);

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'link-secondary');
}

function renderModal(state, elements, postId) {
  const [{ description, link, title }] = state.posts.flat().filter(({ id }) => id === postId);

  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = description;
  elements.modalBtnFullArticle.href = link;
}

export { loadTranslations, renderFeedback, renderPosts, renderRssContent, renderReadAsPost, renderModal };
