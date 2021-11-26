import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initBooking: function () {
    const thisApp = this;

    thisApp.bookingWidget = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingWidget);
  },

  initHome: function () {
    const thisApp = this;

    thisApp.homeWidget = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(thisApp.homeWidget);
  },

  initPages: function () {
    const thisApp = this;
    // pobierana jest zawartość stron w formie tablicy
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    // pobierane są linki do strony (buttony)
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    // po stronie wpisanej strony zamień wytnij #/ z adresu
    const idFromHash = window.location.hash.replace('#/', '');
    // defaultowo strona pierwsza
    let pageMatchingHash = thisApp.pages[0].id;
    // dla wszystkich stron wprowadzony adres jesli pokrywa się z id to wybierz strone
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    // i tą stronę aktywuj
    thisApp.activatePage(pageMatchingHash);

    // pętla do włączania strony przez link:
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);
        window.location.hash = '#' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.pages.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },

  init: function () {
    const thisApp = this;

    thisApp.initHome();
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);

    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
};

app.init();
