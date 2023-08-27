import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Icustomer } from 'src/app/model/icustomer';
import { ISpend } from 'src/app/model/ispend';
import { ISpendTypes } from 'src/app/model/ispend-types';
import { ITimes } from 'src/app/model/itimes';
import { Itravel } from 'src/app/model/itravel';
import { DataService } from 'src/app/services/data.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

import { Component, OnInit, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Icalc } from 'src/app/model/icalc';

export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-travel-form',
  templateUrl: './travel-form.component.html',
  styleUrls: ['./travel-form.component.scss'],
  providers: [MessageService],
})
export class TravelFormComponent implements OnInit {
  userId = localStorage.getItem('userId')?.toString();
  id = this.actRouter.snapshot.params['id'];
  totalAmount = 0;
  defaultStart = moment().add(-5, 'days').toDate();
  defaultEnd = moment().add(-3, 'days').toDate();
  myCalc!: Icalc;
  spends!: ISpend[];
  times: any;
  customers: any;
  uploadedFiles: any[] = [];
  spendTypesList: ISpendTypes[] = [];
  filteredTimes: string[] = [];
  filteredCustomers: Icustomer[] = [];
  myTravel: Itravel = {};
  travelForm = this.fb.group({
    startDate: new FormControl(this.defaultStart),
    startHour: new FormControl('09:00'),
    endDate: new FormControl(this.defaultEnd),
    endHour: new FormControl('18:00'),
    customer: [''],
    city: [''],
    breakfast: false,
    launch: false,
    dinner: false,
    spendItem: this.fb.array([]),
    id: [''],
  });
  spendSum = 0;

  constructor(
    private fb: FormBuilder,
    private utilitiesService: UtilitiesService,
    private messageService: MessageService,
    private actRouter: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.times = this.utilitiesService.getTimes()

    this.spendTypesList = this.utilitiesService.getSpendTyps()

    this.getCustomers();
    // this.utilitiesService.calculateTravel().subscribe((data) => {
    //   console.log(data, 'FromService');
    // });

    if (this.id) {
      this.dataService.getTravelById(this.id).subscribe((data) => {
        //console.log(data, 'Data');
        this.travel2Form(data);
        /*this.travelForm.patchValue(data);*/
      });
    }

    this.travelForm.valueChanges.subscribe(x => {
      this.changesForm();
    })

    this.spends = [];
  }

  form2Travel(form: any) {
    this.myTravel = {
      startDate: form.startDate,
      startHour:
        form.startHour?.value == undefined
          ? form.startHour
          : form.startHour?.value,
      endDate: form.endDate,
      endHour:
        form.endHour?.value == undefined ? form.endHour : form.endHour?.value,
      customer: form.customer,
      city: form.city,
      breakfast: form.breakfast,
      launch: form.launch,
      dinner: form.dinner,
      spendItem: form.spendItem,
      id: form.id,
      user: this.userId,
    };
  }

  travel2Form(travel: Itravel) {
    this.travelForm.patchValue(travel);
    this.travelForm.patchValue({
      startDate: new Date(
        travel.startDate == undefined ? new Date() : travel.startDate
      ),
      endDate: new Date(
        travel.endDate == undefined ? new Date() : travel.endDate
      ),
      //startHour: { value: travel.startHour },
      //endHour: { value: travel.endHour },
    });

    if (travel.spendItem) {
      travel.spendItem.forEach((element) => {
        this.addSpendItem(element as ISpend);
      });
    }

    this.totalAmount =
      travel.totalAmount !== undefined ? travel.totalAmount : 0;
  }

  onSubmit(travelForm: any) {
    this.form2Travel(travelForm);
    if (this.id !== undefined) {
      this.dataService
        .updateTravel(this.myTravel.id, this.myTravel)
        .subscribe((data) => {
          this.router.navigate(['/travel-list']);
        });
    } else {
      this.dataService.createTravel(this.myTravel).subscribe((data) => {
        this.router.navigate(['/travel-list']);
      });
    }
  }

  changesForm() {
    this.calculateTravel(this.travelForm.value);
  }

  getCustomers() {
    this.dataService.getCustomers().subscribe((items) => {
      this.customers = items;
      //console.log(this.customers);
    });
  }

  calculateTravel(travel: any) {
    this.utilitiesService.calculateTravel(travel).then(x => {
      if(x) {
        this.myCalc = x
      }
    });
  }

  onSelectCustomer(value: any) {
    //console.log(value);
    const customerList = this.customers as Icustomer[];
    const customer = customerList.find((x) => x.name === value);
    this.travelForm.patchValue({
      city: customer?.city,
    });
  }

  calcTravel(form: any) {}

  addSpendItem(spends?: ISpend) {
    if (spends) {
      this.spendItem.push(
        this.fb.group({
          type: [{ name: spends.type }],
          date: [new Date(spends.date == undefined ? new Date() : spends.date)],
          value: [spends.value],
        })
      );
    } else {
      this.spendItem.push(
        this.fb.group({
          type: [{ name: 'Auto' }],
          date: new FormControl(new Date()),
          value: [''],
        })
      );
    }
  }

  calcSpend() {
    for (let i = 0; i < this.spendItem.length; i++) {
      console.log(this.spendItem.value[i]);
    }
  }

  deleteSpendItem(i: number) {
    this.spendItem.removeAt(i);
  }

  get spendItem() {
    return this.travelForm.get('spendItem') as FormArray;
  }

  onUpload(event: any) {
    console.log(event, 'FileUploadEvent');
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(this.uploadedFiles, 'FilesArray');
    }
  }

  deleteUpload(i: number) {
    this.uploadedFiles.splice(i, 1);
  }

  filterTime(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.times as any[]).length; i++) {
      let time = (this.times as any[])[i];

      if (time.value.indexOf(query) === 0) {
        filtered.push(time.value);
      }
    }

    this.filteredTimes = filtered;
  }

  filterCustomers(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.customers as any[]).length; i++) {
      let customer = (this.customers as any[])[i];

      if (customer.name.indexOf(query) === 0) {
        filtered.push(customer.name);
      }
    }

    this.filteredCustomers = filtered;
  }
}
