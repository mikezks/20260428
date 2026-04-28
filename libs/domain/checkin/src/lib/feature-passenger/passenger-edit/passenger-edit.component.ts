import { httpResource } from '@angular/common/http';
import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';
import { validatePassengerStatus } from '../../util-validation/passenger-validator/passenger-status.validator';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  entityState = {
    flights: {
      3: {
        id: 3,
        from: 'Paris',
        to: 'NYC'
      },
      5: {
        id: 5,
        from: 'London',
        to: 'LA'
      },
    },
    ids: [5, 3]
  };

  myFlight3 = this.entityState.flights[3];

  readonly id = input(0, { transform: numberAttribute });
  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), {
    defaultValue: initialPassenger
  });
  
  constructor() {
    effect(() => console.log(this.id()));
    effect(() => {
      if (this.passengerResource.hasValue()) {
        this.editForm.patchValue(this.passengerResource.value());
      }
    });
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
