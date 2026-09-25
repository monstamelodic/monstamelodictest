const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  });
}

document.querySelectorAll('.member-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.member-card');
    const open = card.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    if (open) card.querySelector('.member-close')?.focus();
  });
});
document.querySelectorAll('.member-close').forEach(button => {
  button.addEventListener('click', event => {
    const card = button.closest('.member-card');
    card.classList.remove('is-open');
    const toggle = card.querySelector('.member-toggle');
    toggle.setAttribute('aria-expanded', 'false');
    if (event.detail === 0) toggle.focus(); else toggle.blur();
  });
});

const filters = document.querySelectorAll('[data-filter]');
const staffCards = document.querySelectorAll('[data-department]');
filters.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  staffCards.forEach(card => { card.hidden = value !== 'All' && card.dataset.department !== value; });
}));

// Edit posts.json to publish news without changing this file.
async function loadPosts() {
  const latest = document.querySelector('#latest-posts');
  const archive = document.querySelector('#news-archive');
  if (!latest && !archive) return;
  try {
    const response = await fetch('posts.json', {cache:'no-cache'});
    if (!response.ok) throw new Error('News unavailable');
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('Invalid news data');
    posts.sort((a,b) => String(b.date).localeCompare(String(a.date)));
    const valid = posts.filter(post => /^[a-z0-9-]+$/.test(post.slug || '') && post.title && post.date);
    const dateLabel = date => {
      const d = new Date(`${date}T12:00:00`);
      return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    };
    function postLink(post) {
      return `news.html?post=${encodeURIComponent(post.slug)}`;
    }
    if (latest) {
      latest.replaceChildren();
      valid.slice(0,3).forEach(post => {
        const a = document.createElement('a'); a.className='news-tile'; a.href=postLink(post);
        const tag=document.createElement('span');tag.textContent=`${dateLabel(post.date)} / ${post.category || 'News'}`;
        const title=document.createElement('h3');title.textContent=post.title;
        const more=document.createElement('span');more.textContent='Read story ↗';
        a.append(tag,title,more);latest.append(a);
      });
    }
    if (archive) {
      archive.replaceChildren();
      const slug = new URLSearchParams(location.search).get('post');
      const selected = valid.find(post => post.slug === slug);
      const article = document.querySelector('#article-view');
      if (selected && article) {
        archive.hidden = true; article.hidden = false;
        article.querySelector('.article-kicker').textContent = `${dateLabel(selected.date)} / ${selected.category || 'News'}`;
        article.querySelector('h2').textContent = selected.title;
        const body=article.querySelector('.article-body');body.replaceChildren();
        (Array.isArray(selected.body) ? selected.body : []).forEach(paragraph => {
          const p=document.createElement('p');p.textContent=paragraph;body.append(p);
        });
        document.title = `${selected.title} · Monsta Melodic`;
      } else {
        if (slug) {
          const notice=document.createElement('p');notice.textContent='That story could not be found. Here are all our updates.';archive.append(notice);
        }
        valid.forEach(post => {
          const a=document.createElement('a');a.className='archive-item';a.href=postLink(post);
          const time=document.createElement('time');time.dateTime=post.date;time.textContent=dateLabel(post.date);
          const group=document.createElement('div');
          const category=document.createElement('span');category.className='category';category.textContent=post.category || 'News';
          const title=document.createElement('h3');title.textContent=post.title;
          const excerpt=document.createElement('p');excerpt.textContent=post.excerpt || '';
          const arrow=document.createElement('span');arrow.className='arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';
          group.append(category,title,excerpt);a.append(time,group,arrow);archive.append(a);
        });
        if (!valid.length) archive.textContent='No updates have been published yet.';
      }
    }
  } catch(error) {
    if (archive) archive.textContent='News could not load right now. Please try refreshing the page.';
  }
}
loadPosts();
