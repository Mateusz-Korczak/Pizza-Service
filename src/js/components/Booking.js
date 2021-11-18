import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {
      wrapper: (element.innerHTML = generatedHTML),
      peopleAmount: document.querySelector(select.booking.peopleAmount),
      hoursAmount: document.querySelector(select.booking.hoursAmount),
      datePicker: document.querySelector(select.widgets.datePicker.wrapper),
      hourPicker: document.querySelector(select.widgets.hourPicker.wrapper),
    };
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.amountPeopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.amountHoursWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.peopleAmount.addEventListener('click', () => {});
    thisBooking.dom.hoursAmount.addEventListener('click', () => {});
  }
}

export default Booking;
