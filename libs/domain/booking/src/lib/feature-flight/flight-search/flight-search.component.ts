import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight } from '@flight-demo/domain/booking-api-boarding';
import { BookingStore } from '../../logic-flight/state/booking.store';
import { FlightCardComponent } from '../../ui-flight/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui-flight/flight-filter/flight-filter.component';


@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  protected readonly store = inject(BookingStore);

  protected readonly filter = this.store.filter;
  protected readonly route = this.store.route;
  protected readonly basket = this.store.basket;
  protected readonly flights = this.store.flights;

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    const flights = this.flights().map(
      flight => flight.id === newFlight.id ? newFlight : flight
    );

    this.store.setFlights(flights);
  }

  protected reset(): void {
    this.store.setFlights([]);
  }
}
