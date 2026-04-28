import { Component, DestroyRef, Injector, Input, OnChanges, SimpleChanges, inject, runInInjectionContext } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { initialFlight } from '../../logic-flight/model/flight';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


function injectGreetUser(message: string): void {
  inject(DestroyRef).onDestroy(() => console.log(message));
}

@Component({
  selector: 'app-flight-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnChanges {
  @Input() flight = initialFlight;

  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });

  counter = timer(0, 2_000).pipe(
    takeUntilDestroyed()
  ).subscribe(console.log);

  constructor() {
    injectGreetUser('Bye, bye! :(');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flight'].previousValue !== changes['flight'].currentValue) {
      this.editForm.patchValue(this.flight);
    }
  }

  protected save(): void {
    console.log(this.editForm.value);

    /* timer(0, 2_000).pipe(
      takeUntilDestroyed()
    ).subscribe(console.log); */

    runInInjectionContext(
      this.injector,
      () => injectGreetUser('Bye, bye! :(')
    );    
  }
}
