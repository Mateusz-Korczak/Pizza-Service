import { classNames, select, settings, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.selectedTableId = 0;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.booking +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([booking, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(booking, eventsCurrent, eventsRepeat);
      });
  }

  parseData(booking, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of booking) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvaible = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvaible = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if (
        !allAvaible &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  resetTables() {
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.classList.remove(classNames.booking.tableSelected);
    }
    thisBooking.selectedTableId = 0;
  }
  initTables(selectedTable) {
    const thisBooking = this;
    if (
      selectedTable.target.classList.contains(classNames.booking.table) &
      !selectedTable.target.classList.contains(classNames.booking.tableBooked)
    ) {
      for (let table of thisBooking.dom.tables) {
        if (table != selectedTable.target) {
          table.classList.remove(classNames.booking.tableSelected);
        }
      }
      selectedTable.target.classList.toggle(classNames.booking.tableSelected);
    } else if (
      selectedTable.target.classList.contains(classNames.booking.tableBooked)
    ) {
      alert('This table is already booked.');
    }

    if (
      selectedTable.target.classList.contains(classNames.booking.tableSelected)
    ) {
      this.selectedTableId = selectedTable.target.getAttribute(
        settings.booking.tableIdAttribute
      );
    } else {
      this.selectedTableId = 0;
    }
  }

  render(wrapper) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.tablesWrapper = thisBooking.dom.wrapper.querySelector(
      select.booking.tablesWrapper
    );
    thisBooking.dom.phoneInput = thisBooking.dom.wrapper.querySelector(
      '.order-confirmation input[type="tel"]'
    );
    thisBooking.dom.addressInput = thisBooking.dom.wrapper.querySelector(
      '.order-confirmation input[type="text"]'
    );
    thisBooking.dom.submitButton = thisBooking.dom.wrapper.querySelector(
      '.order-confirmation button[type="submit"]'
    );
    thisBooking.dom.starters =
      thisBooking.dom.wrapper.querySelectorAll('.checkbox input');
    console.log(thisBooking.dom.starters);
  }

  /*----------------------------------*/
  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: this.selectedTableId,
      duration: thisBooking.amountHoursWidget.value,
      ppl: thisBooking.amountPeopleWidget.value,
      starters: [],
      phone: thisBooking.dom.phoneInput.value,
      address: thisBooking.dom.addressInput.value,
    };
    for (let option of thisBooking.dom.starters) {
      if (option.checked) {
        payload.starters.push(option.value);
      }
    }
    console.log('wyslano booking: ', payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options).then(function (response) {
      if (response.ok) {
        console.log('poszlo!');
        console.log('date: ', payload.date);
        console.log('hour: ', payload.hour);
        console.log('duration: ', payload.duration);
        console.log('table: ', payload.table);
        thisBooking.makeBooked(
          payload.date,
          payload.hour,
          payload.duration,
          parseInt(payload.table)
        );
        thisBooking.resetTables();
        thisBooking.updateDOM();
      }
    });
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.amountPeopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.amountHoursWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.peopleAmount.addEventListener('click', () => {});
    thisBooking.dom.hoursAmount.addEventListener('click', () => {});
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.resetTables();
      thisBooking.updateDOM();
    });

    thisBooking.dom.tablesWrapper.addEventListener('click', (e) => {
      thisBooking.initTables(e);
    });
    thisBooking.dom.submitButton.addEventListener('click', function (e) {
      console.log('dziala');
      e.preventDefault();
      thisBooking.sendBooking();
    });
  }
}

export default Booking;
