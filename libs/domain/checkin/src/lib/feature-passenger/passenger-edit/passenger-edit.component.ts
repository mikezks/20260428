import { httpResource } from '@angular/common/http';
import { Component, input, linkedSignal, numberAttribute } from '@angular/core';
import { apply, form, FormField, FormRoot, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';
import { Address, AddressControl, addressSchema, initialAddress } from '@flight-demo/shared/core';


export function validateLastname(
  field: SchemaPath<string>,
  allowedLastnames: string[],
  message: string
): void {
  validate(field, ({ value }) =>
    allowedLastnames.includes(value())
      ? null
      : {
        kind: 'forbiddenLastname',
        message: message + 'Enter one of the following names: '
          + allowedLastnames.join(', ')
      }
  );
}

// (3) Field Logic: Validators, conditional disabled, ...
export const passengerSchema = schema<Passenger & {
  address: Address
}>(passengerPath => {
  required(passengerPath.name, {
    message: 'The lastname is mandatory!'
  });
  validateLastname(passengerPath.name, [
    'Mustermann', 'Smith'
  ], 'The lastname is invalid. ');
  apply(passengerPath.address, addressSchema);
});


@Component({
  selector: 'app-passenger-edit',
  imports: [
    RouterLink,
    // (4) UI Control: Template Binding
    FormField,
    FormRoot,
    AddressControl
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  readonly id = input(0, { transform: numberAttribute });
  
  // (1) Data Model: Writable Signal
  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), { defaultValue: initialPassenger });

  private readonly passengerWithAddress = linkedSignal(() => ({
    ...this.passengerResource.value(),
    address: initialAddress
  }));

  // (2) Field State: value, valid, touched, dirty, ...
  protected readonly editForm = form(this.passengerWithAddress, passengerSchema, {
    submission: { action: async () => this.save() }
  });

  protected save(): void {
    console.log({
      form: this.editForm().value(),
      resource: this.passengerResource.value(),
      linkedDataModel: this.passengerWithAddress()
    });
  }
}
