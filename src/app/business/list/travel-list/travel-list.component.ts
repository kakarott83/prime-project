import { filter, map, take, tap, timeout } from 'rxjs';
import { Itravel } from 'src/app/model/itravel';
import { DataService } from 'src/app/services/data.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit {
  userId = localStorage.getItem('userId');
  travels: Itravel[] = [];
  selectedTravels: Itravel[] = [];
  filteredTravels: Itravel[] = [];
  loading: boolean = true;
  responseFilter: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTravel();
  }

  deleteTravel(id: any) {
    this.dataService.deleteTravel(id).subscribe((data) => {
      this.loadTravel();
    });
  }

  loadTravel() {
    this.dataService
      .getTravels()
      //.pipe(filter((x) => x.user == this.userId))
      .pipe(
        tap((response) => console.log(response, 'Before')),
        map((x) =>
          x.filter((items) => {
            return items.user === this.userId;
          })
        ),
        tap((x) => console.log(x, 'After'))
      )

      .subscribe((data: {}) => {
        console.log(data);
        this.travels = data as Itravel[];
        this.loading = false;
      });
  }
}
