import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelListComponent } from './business/list/travel-list/travel-list.component';
import { MenuComponent } from './business/menu/menu.component';
import { TravelFormComponent } from './business/travel-form/travel-form.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { StyleTestComponent } from './tests/style-test/style-test.component';

@NgModule({
  declarations: [
    AppComponent,
    StyleTestComponent,
    MenuComponent,
    TravelFormComponent,
    LoginFormComponent,
    TravelListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
    ToastModule,
    DividerModule,
    TableModule,
    MessagesModule,
    CardModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    InputNumberModule,
    AutoCompleteModule,
    TooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
