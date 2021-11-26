import { select, templates } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(wrapper) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.peopleAmount = thisHome.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisHome.dom.hoursAmount = thisHome.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisHome.dom.datePicker = thisHome.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisHome.dom.hourPicker = thisHome.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisHome.dom.tables = thisHome.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisHome.dom.tablesWrapper = thisHome.dom.wrapper.querySelector(
      select.booking.tablesWrapper
    );
    thisHome.dom.phoneInput = thisHome.dom.wrapper.querySelector(
      '.order-confirmation input[type="tel"]'
    );
    thisHome.dom.addressInput = thisHome.dom.wrapper.querySelector(
      '.order-confirmation input[type="text"]'
    );
    thisHome.dom.submitButton = thisHome.dom.wrapper.querySelector(
      '.order-confirmation button[type="submit"]'
    );
    thisHome.dom.starters =
      thisHome.dom.wrapper.querySelectorAll('.checkbox input');
    console.log(thisHome.dom.starters);
  }

  initWidgets() {
    const thisHome = this;

    console.log(thisHome);
  }
}

export default Home;
