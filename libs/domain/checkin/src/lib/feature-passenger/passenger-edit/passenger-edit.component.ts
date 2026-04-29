import { httpResource } from '@angular/common/http';
import { Component, effect, input, numberAttribute, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';


// (3) Field Logic: Validators, conditional disabled, ...


@Component({
  selector: 'app-passenger-edit',
  imports: [
    RouterLink,
    // (4) UI Control: Template Binding
    FormField,
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  // (1) Data Model: Writable Signal
  private readonly passenger = signal(initialPassenger);

  // (2) Field State: value, valid, touched, dirty, ...
  protected editForm = form(this.passenger);

  readonly id = input(0, { transform: numberAttribute });
  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), {
    defaultValue: initialPassenger
  });
  
  constructor() {
    effect(() => console.log(this.id()));
  }

  protected save(): void {
    console.log({
      datamodel: this.passenger(),
      form: this.editForm().value(),
      resource: this.passengerResource.value()
    });
  }
}
