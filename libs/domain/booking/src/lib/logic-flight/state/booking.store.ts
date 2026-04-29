import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Flight } from '../model/flight';
import { FlightFilter } from '../model/flight-filter';
import { pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { FlightService } from '../data-access/flight.service';
import { addMinutes } from '@flight-demo/shared/core';

export interface BookingState {
  filter: FlightFilter;
  basket: Record<number, boolean>;
}

export const initialBookingState: BookingState = {
  filter: {
    from: 'London',
    to: 'New York',
    urgent: false
  },
  basket: {
    3: true,
    5: true,
  },
};

const flightConfig = entityConfig({
  entity: type<Flight>(),
  collection: 'flight'
});


export const BookingStore = signalStore(
  // Dependency Injection Config
  { providedIn: 'root' },
  // State
  withState(initialBookingState),
  withEntities(flightConfig),
  withComputed(store => ({
    delayed: () => store.flightEntities().filter(flight => flight.delayed),
    route: () => 'From ' + store.filter.from() + ' to ' + store.filter.to() + '.'
  })),
  // Updaters
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) =>
      patchState(store, setAllEntities(flights, flightConfig)),
    delayFlight: (id: number, min = 5) => patchState(store,
      updateEntity({ id, changes: flight => ({
        date: addMinutes(flight.date, min)
      })}, flightConfig)
    ),
    resetFlights: () =>
      patchState(store, removeAllEntities(flightConfig)),
    updateBasket: (id: number, selected: boolean) => patchState(store, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
  })),
  // Side-Effects
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights: rxMethod<FlightFilter>(pipe(
      switchMap(filter => flightService.find(filter).pipe(
        tapResponse({
          next: flights => store.setFlights(flights),
          error: err => console.error(err),
        })
      )),
    )),
  })),
  // Lifecycle Hooks
  withHooks(store => ({
    onInit: () => store.loadFlights(store.filter),
  })),
);