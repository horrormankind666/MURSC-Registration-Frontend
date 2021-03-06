/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๒/๑๑/๒๕๖๓>
Modify date : <๑๘/๑๑/๒๕๖๓>
Description : <>
=============================================
*/

'use strict';

import {Component, Input, OnInit} from '@angular/core';

import {NgbNav, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import {AppService} from '../app.service';
import {Schema} from '../data.service';

@Component({
  selector: 'app-formless',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @Input() data$: Schema.TransSchedule;

  constructor(
    private appService: AppService
  ) {}

  data: any = {
    transSchedule$: null
  };

  section: any = {
    active: 1
  };

  ngOnInit() {
    this.data.transSchedule$ = this.data$;
  }
}
