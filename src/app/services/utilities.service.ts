import { delay, filter, first, map, Observable, Observer } from 'rxjs';

import { Injectable } from '@angular/core';

import { Icalc } from '../model/icalc';
import { Icountry } from '../model/icountry';
import { Icustomer } from '../model/icustomer';
import { ISpendTypes } from '../model/ispend-types';
import { ITimes } from '../model/itimes';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private timeObserverable: any;
  private spendObserverable: any;
  private calcObserverable: any;
  private myCustomer: any;
  private myCountry!: Icountry;
  private minutes = ['00', '15', '30', '45'];
  private times: ITimes[] = [];
  private spendType: ISpendTypes = [
    { name: 'Auto' },
    { name: 'Taxi' },
    { name: 'Hotel' },
    { name: 'Fähre' },
    { name: 'Sonstiges' },
  ];

  constructor(private dataService: DataService) {
    this.generateTimes();
  }

  getTimes() {
    const timeObservable = new Observable((observer) => {
      this.timeObserverable = observer;
      observer.next(this.times);
      observer.complete();
    });

    return timeObservable;
  }

  getSpendTyps() {
    const spendTypObservable = new Observable((observer) => {
      this.spendObserverable = observer;
      observer.next(this.spendType);
      observer.complete();
    });

    return spendTypObservable;
  }

  private generateTimes() {
    let selectTime: ITimes;
    let dropDownTimes: string;
    for (let hours = 0; hours < 24; hours++) {
      for (let index = 0; index < 4; index++) {
        selectTime = {
          value: hours.toString() + ':' + this.minutes[index],
        };
        this.times.push(selectTime);
      }
    }
  }

  calculateTravel() {
    let cust: any;
    let c = 'BANK-now';
    let myCalc: Icalc = {};
    const calcObservable = new Observable((observer) => {
      this.calcObserverable = observer;
      observer.next(myCalc);
      observer.complete();

      /*Customer ermitteln*/

      //console.log(this.getCustomerByName(c), 'GetCustomer');
      cust = this.getCustomerByName(c);

      console.log(cust, 'Cust');
    });

    return calcObservable;
  }

  private async getCustomerByName(name: string) {
    return await this.dataService
      .getCustomers()
      .pipe(map((items) => items.filter((res) => res.name === name)))
      .subscribe((data) => {
        data[0];
      });
  }
}
