import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './auth/auth.guard';

@NgModule({
  imports: [
    FormsModule, // [(ngModel)]
    CommonModule, // ngFor, ngIf, ngStyle, ngClass, date, json
  ],
  providers: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      providers: [AuthGuard],
      ngModule: SharedModule,
    };
  }
}
