import { firstValueFrom, map } from 'rxjs';

import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { Icalc } from '../model/icalc';
import { Icountry } from '../model/icountry';
import { Icustomer } from '../model/icustomer';
import { ISpendTypes } from '../model/ispend-types';
import { ITimes } from '../model/itimes';
import { Itravel } from '../model/itravel';
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
  private spendTypes: ISpendTypes[] = [
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
    return this.times;

    // const timeObservable = new Observable((observer) => {
    //   this.timeObserverable = observer;
    //   observer.next(this.times);
    //   observer.complete();
    // });
  }

  getSpendTyps() {
    //return of(this.spendTypes)
    return this.spendTypes;
    // const spendTypObservable = new Observable((observer) => {
    //   this.spendObserverable = observer;
    //   observer.next(this.spendType);
    //   observer.complete();
    // });
    // return spendTypObservable;
  }

  private generateTimes() {
    let selectTime: ITimes;
    for (let hours = 0; hours < 24; hours++) {
      for (let index = 0; index < 4; index++) {
        selectTime = {
          value: hours.toString() + ':' + this.minutes[index],
        };
        this.times.push(selectTime);
      }
    }
  }

  private async tryGetDataFromDb(method: Function, ...params: any[]) {
    const _params = params?.filter((p) => p !== null && p !== undefined);

    if (_params.length > 0) {
      return await method(...params);
    } else {
      return null;
    }
  }

  async calculateTravel(travel: any) {
    const myTravel: Itravel = travel;
    const myCustomerName =
      myTravel.customer === undefined ? null : myTravel.customer;
    const myCalc: Icalc = {};

    const myCustomer: Icustomer = await this.tryGetDataFromDb(
      this.getCustomerByName.bind(this),
      myCustomerName
    );
    const myCountry: Icountry = await this.tryGetDataFromDb(
      this.getCountryByName.bind(this),
      myCustomer.country
    );

    /*Search Customer*/
    // if(myCustomerName !== null) {
    //   myCustomer = await this.getCustomerByName(myCustomerName)
    //   console.log(myCustomer,'myCustomer')
    // } else {
    //   return null
    // }

    /*Search Country From Customer*/
    // if(myCustomer.country) {
    //   myCountry = await this.getCountryByName(myCustomer.country)
    //   console.log(myCountry,'myCountry')
    // } else {
    //   return null
    // }

    if (
      myTravel.startDate &&
      myTravel.startHour &&
      myTravel.endDate &&
      myTravel.endHour
    ) {
      const start = this.createDate(myTravel.startDate, myTravel.startHour);
      const end = this.createDate(myTravel.endDate, myTravel.endHour);

      const dur = moment.duration(end.diff(start));

      myCalc.durationDays = Math.floor(dur.asDays());
      myCalc.durationHours = dur.hours();
      myCalc.durationMin = dur.minutes();
      myCalc.spendAmount = 0;
      myCalc.totalAmount = 0;

      /*ToDo Bools als eigenes Objekt*/
      myCalc.totalAmount = this.calcTravelAmount(myCalc, myCountry, myTravel);

      myTravel.spendItem?.forEach((x) => {
        console.log(Number(x.value), 'Spend');
        myCalc.spendAmount += x.value === undefined ? 0 : x.value;
        myCalc.totalAmount += x.value === undefined ? 0 : x.value;
      });

      console.log(myCalc);
    }

    return myCalc;
  }

  private getCustomerByName(name: string): Promise<Icustomer> {
    return firstValueFrom(
      this.dataService.getCustomers().pipe(
        map((items) => items.filter((res) => res.name === name)),
        map((resp) => resp[0])
      )
    );
  }

  private getCountryByName(name: string) {
    return firstValueFrom(
      this.dataService.getCountry().pipe(
        map((items) => items.filter((res) => res.name === name)),
        map((resp) => resp[0])
      )
    );
  }

  private createDate(startDate: any, startHours: any) {
    const timeSplit = startHours.split(':');
    const myDate = new Date(startDate);
    myDate.setHours(Number(timeSplit[0]));
    myDate.setMinutes(Number(timeSplit[1]));

    return moment(myDate);
  }

  private calcTravelAmount(
    calc: Icalc,
    myCountry: Icountry,
    myTravel: Itravel
  ) {
    let amount = 0;
    const b = myTravel.breakfast === true ? 0.2 : 1;
    const l = myTravel.launch === true ? 0.4 : 1;
    const d = myTravel.dinner === true ? 0.4 : 1;

    /*Travel without Overnight*/
    if (calc.durationDays !== undefined && calc.durationHours !== undefined) {
      if (calc.durationDays === 0 && calc.durationHours >= 8) {
        /*Partical Amount*/
        amount = Number(myCountry.partAmount);
      }

      /*Travel with 1 Overnight*/
      if (calc.durationDays === 1) {
        /*Arrival*/
        amount = Number(myCountry.partAmount);

        /*Departure*/
        amount += Number(myCountry.partAmount) * (1 - b);
      }

      if (calc.durationDays > 1) {
        /*Arrival*/
        amount = Number(myCountry.partAmount);

        /*Duration*/
        amount +=
          Number(myCountry.fullAmount) * (1 - b) * (calc.durationDays - 1);

        /*Departure*/
        amount += Number(myCountry.partAmount) * (1 - b);
      }
    }

    return amount;
  }
}
