import {
  catchError,
  delay,
  filter,
  Observable,
  pipe,
  retry,
  throwError,
} from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Icountry } from '../model/icountry';
import { Icustomer } from '../model/icustomer';
import { Itravel } from '../model/itravel';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getTravels(): Observable<Itravel[]> {
    return this.http
      .get<Itravel[]>(this.apiUrl + '/travels')
      .pipe(retry(1), catchError(this.handleError));
  }

  getTravelById(id: any): Observable<Itravel> {
    return this.http
      .get<Itravel>(this.apiUrl + '/travels/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  createTravel(travel: any): Observable<Itravel> {
    return this.http
      .post<Itravel>(
        this.apiUrl + '/travels',
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateTravel(id: any, travel: any): Observable<Itravel> {
    return this.http
      .put<Itravel>(
        this.apiUrl + '/travels/' + id,
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteTravel(id: any) {
    return this.http
      .delete(this.apiUrl + '/travels/' + id, this.headerOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /*Customer*/
  getCustomers(): Observable<Icustomer[]> {
    return this.http
      .get<Icustomer[]>(this.apiUrl + '/customers')
      .pipe(retry(1), catchError(this.handleError));
  }

  getCustomerById(id: any): Observable<Icustomer> {
    return this.http
      .get<Icustomer>(this.apiUrl + '/customers/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  customerTravel(travel: any): Observable<Icustomer> {
    return this.http
      .post<Icustomer>(
        this.apiUrl + '/customers',
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCustomer(id: any, travel: any): Observable<Icustomer> {
    return this.http
      .put<Icustomer>(
        this.apiUrl + '/customers/' + id,
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteCustomer(id: any) {
    return this.http
      .delete(this.apiUrl + '/customers/' + id, this.headerOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /*Country*/
  getCountry(): Observable<Icountry[]> {
    return this.http
      .get<Icountry[]>(this.apiUrl + '/countries')
      .pipe(retry(1), catchError(this.handleError));
  }

  getCountryById(id: any): Observable<Icountry> {
    return this.http
      .get<Icountry>(this.apiUrl + '/countries/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  countryTravel(travel: any): Observable<Icountry> {
    return this.http
      .post<Icountry>(
        this.apiUrl + '/countries',
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCountry(id: any, travel: any): Observable<Icountry> {
    return this.http
      .put<Icountry>(
        this.apiUrl + '/countries/' + id,
        JSON.stringify(travel),
        this.headerOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteCountry(id: any) {
    return this.http
      .delete(this.apiUrl + '/countries/' + id, this.headerOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /*Errors*/
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
