/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๐/๐๒/๒๕๖๓>
Modify date : <๐๔/๐๓/๒๕๖๓>
Description : <>
=============================================
*/

'use strict';

import {Injectable, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';

import {DataService, ProjectSchema} from '../data.service';

interface TableState {
  page: number;
  pageSize: number;
  keyword: string;
  registrationStatus: string;
}

interface TableSearchResult {
  data: ProjectSchema[];
  total: number;
  totalSearch: number;
}

class Table {
  constructor(
    private pipe: DecimalPipe,
    private dataService: DataService
  ) {
    this.dataService.project.getList().then((res: ProjectSchema[]) => {
      this._search$.pipe(
        tap(() => this._searching$.next(true)),
        debounceTime(100),
        switchMap(() => this._search(res)),
        delay(100),
        tap(() => this._searching$.next(false))
      ).subscribe(result => {
        this._data$.next(result.data);
        this._total$.next(result.total);
        this._totalSearch$.next(result.totalSearch);
      });

      this._search$.next();
    });
  }

  private _searching$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _data$ = new BehaviorSubject<ProjectSchema[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _totalSearch$ = new BehaviorSubject<number>(0);

  private _state: TableState = {
    page: 1,
    pageSize: 4,
    keyword: '',
    registrationStatus: ''
  }

  get data$() {return this._data$.asObservable();}
  get total$() {return this._total$.asObservable();}
  get totalSearch$() {return this._totalSearch$.asObservable();}
  get searching$() {return this._searching$.asObservable();}
  get page() {return this._state.page;}
  get pageSize() {return this._state.pageSize;}
  get keyword() {return this._state.keyword;}
  get registrationStatus() {return this._state.registrationStatus;}

  set page(page: number) {this._set({page});}
  set pageSize(pageSize: number) {this._set({pageSize});}
  set keyword(keyword: string) {this._set({keyword});}
  set registrationStatus(registrationStatus: string) {this._set({registrationStatus});}

  private _set(patch: Partial<TableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(data: ProjectSchema[]): Observable<TableSearchResult> {
    const {page, pageSize, keyword, registrationStatus} = this._state;

    let tmp = data;

    tmp = tmp.filter(project => this.matches(project, keyword, registrationStatus, this.pipe));
    const total: number = data.length;
    const totalSearch: number = tmp.length;

    data = tmp;

    return of({data, total, totalSearch});
  }

  matches(data: ProjectSchema, keyword: string, registrationStatus: string, pipe: PipeTransform) {
    keyword = (keyword ? keyword : '');
    registrationStatus = (registrationStatus ? registrationStatus : '');

    return (
      (data.projectName.th.toLowerCase().includes(keyword.toLowerCase()) ||
       data.projectName.en.toLowerCase().includes(keyword.toLowerCase())) &&
      data.registrationStatus.includes(registrationStatus)
    )
  }
}

class Operate {
  constructor(
    private pipe: DecimalPipe,
    private dataService: DataService,
  ) {}

  table = {
    service: new Table(this.pipe, this.dataService),
    filter: {
      showForm: false,
      setValue() {
        this.showForm = false;
      }
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private pipe: DecimalPipe,
    private dataService: DataService
  ) {}

  public operate = new Operate(this.pipe, this.dataService);
}