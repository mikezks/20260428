import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FlightService } from '../../logic-flight/data-access/flight.service';
import { Flight } from '../../logic-flight/model/flight';
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
  private flightService = inject(FlightService);

  protected filter = signal({
    from: 'Paris',
    to: 'New York',
    urgent: false
  });
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights$ = new BehaviorSubject<Flight[]>([]);

  constructor() {
    effect(() => console.log(this.filter()));
    effect(() => {
      this.filter();
      untracked(() => this.search());
    });
  }

  protected search(): void {
    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.flightService.find(
      this.filter().from, this.filter().to, this.filter().urgent
    ).subscribe(
      flights => this.flights$.next(flights)
    );
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    const flights = this.flights$.value.map(
      flight => flight.id === newFlight.id ? newFlight : flight
    );

    this.flights$.next(flights);
  }

  protected reset(): void {
    this.flights$.next([]);
  }
}
