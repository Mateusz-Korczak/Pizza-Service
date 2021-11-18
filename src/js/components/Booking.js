import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
class Booking {
  /* DONE: odbiera referencję do kontenera przekazaną w app.initBooking, jako argument (np. o nazwie element), */
  constructor(element) {
    const thisBooking = this;
    // console.log('element from Booking constructor: ', element);
    /* DONE: wywołuje metodę render, przekazując tę referencję dalej (render musi mieć w końcu dostęp do kontenera)*/
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element) {
    /* DONE: generowanie kodu HTML za pomocą szablonu templates.bookingWidget, przy czym nie musimy przekazywać do niego żadnych danych, gdyż ten szablon nie oczekuje na żaden placeholder, */
    // console.log('element from Booking render method: ', element);
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    // console.log('generated HTML: ', generatedHTML);
    /* DONE: utworzenie pustego obiektu thisBooking.dom, */
    thisBooking.dom = {
      /* DONE: dodanie do tego obiektu właściwości wrapper i przypisanie do niej referencji do kontenera (jest dostępna w argumencie metody), */
      wrapper: (element.innerHTML = generatedHTML),
      peopleAmount: document.querySelector(select.booking.peopleAmount),
      hoursAmount: document.querySelector(select.booking.hoursAmount),
    };
    // console.log(thisBooking.dom.peopleAmount);
    // console.log(thisBooking.dom.hoursAmount);
    /* DONE: zmiana zawartości wrappera (innerHTML) na kod HTML wygenerowany z szablonu.*/
  }

  initWidgets() {
    const thisBooking = this;
    /* TODO: Potem, już w samej metodzie, zadbaj o utworzenie nowych instancji AmountWidget na obu przygotowanych wcześniej elementach. Pamiętaj, że teraz tworzymy dwa widgety, a nie jeden, i nie potrzebujemy jeszcze robić nic w momencie wykrycia zmiany. Nasłuchiwacze mogą więc już istnieć, ale ich funkcje callback nie muszą niczego przeliczać ani uruchamiać. Na dobrą sprawę, funkcje callback mogą być nawet na razie puste. */
    thisBooking.amountPeopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.amountHoursWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.dom.peopleAmount.addEventListener('click', () => {
      // console.log('siema');
    });
    thisBooking.dom.hoursAmount.addEventListener('click', () => {
      // console.log('siema');
    });
    // console.log('Booking initWidgets method is working');
  }

  //   initAmountWidget() {
  //     const thisCartProduct = this;
  //     thisCartProduct.amountWidget = new AmountWidget(
  //       thisCartProduct.dom.amountWidget
  //     );
  //     thisCartProduct.dom.amountWidget.input.value = thisCartProduct.amount;
  //     thisCartProduct.dom.amountWidget.addEventListener('updated', () => {
  //       thisCartProduct.amount = thisCartProduct.amountWidget.input.value;
  //       thisCartProduct.price =
  //         thisCartProduct.amount * thisCartProduct.priceSingle;
  //       thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
  //     });
  //   }
}

export default Booking;
