import { apiToken } from '../key/apiKey.js';
import { addNews } from './addOneNews.js';

let url = ('https://gnews.io/api/v4/top-headlines?&');

const getJson = async (event) => {
  if (event !== 0 && typeof (event) !== 'string') { event = `${event.path[0].innerText}`};
  if (event !== 0 && typeof (event) !== 'string') { event = `${event.path[0].innerText}`};
  if (event === 'home') url = 'https://gnews.io/api/v4/top-headlines?&';
  if (event !== 0 && event !== 'home') url = 'https://gnews.io/api/v4/search?q=';
  if (event === 0) event = '';
  const promisse = await fetch(`${url}${event}&country=br&token=${apiToken}`);
  return promisse.json();
};

const removeLinkClickedBefore = () => {
  const itemsMenu = document.querySelectorAll('.link-menu-header');
  itemsMenu.forEach((item) => {
    item.classList.remove('text-secondary');
    item.classList.add('text-white');
  });
};

const printNews = (news) => {
  const newsMain = document.getElementById('news-main');

  news.forEach((New, index) => {
    const { title, description, image } = New;
    const linkNews = New.url;
    const column = addNews(title, description, image, linkNews);
    if (index < 1) column.classList.add('main-col');
    newsMain.appendChild(column);
  });
};

const verifyPageItems = () => {
  const main = document.querySelector('#news-main');
  const mainItems = document.querySelectorAll('.col');
  if (mainItems.length > 1) {
    mainItems.forEach((item) => main.removeChild(item));
  }
};

const main = async (event = 0) => {
  verifyPageItems(); // Verifica se existem noticias na pagina e remove se existirem.
  const news = await getJson(event); // busca noticias na api baseado no evento que a encadeou.
  printNews(news.articles); // Coloca as noticias na pagina.
};

const addEventToNav = () => {
  const nav = document.querySelectorAll('li');
  nav.forEach((item, index) => {
    if (index <= 4) {
      item.addEventListener('click', main);
      item.addEventListener('click', (e) => {
        const linkClicked = e.target;
        removeLinkClickedBefore();
        linkClicked.classList.remove('text-white');
        linkClicked.classList.add('text-secondary');
      });
    }
  });
};

const searchByInput = () => {
  main(document.querySelector('#input-news').value);
};

const addEventToButton = () => {
  const button = document.querySelector('#button-search');
  button.addEventListener('click', (event) => {
    event.preventDefault();
    searchByInput();
  });
};

window.onload = () => {
  main(); // Faz "Tudo"
  addEventToNav(); // adiciona eventos a barra de navegação
  addEventToButton(); // adiciona evento ao botão de pesquisa
};

module.exports = { getJson };
