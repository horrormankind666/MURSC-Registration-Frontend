/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๖/๒๕๖๓>
Modify date : <๒๙/๐๖/๒๕๖๓>
Description : <>
=============================================
*/

'use strict';

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AppService} from '../../app.service';
import {AuthService} from '../../auth.service';
import {Schema, DataService} from '../../data.service';
import {ModalService} from '../../modal/modal.service';

import {ModalErrorComponent} from '../../modal/modal.component';

@Component({
  selector: 'app-registered-detail',
  templateUrl: './registered-detail.component.html',
  styleUrls: ['./registered-detail.component.scss']
})
export class RegisteredDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    private dataService: DataService,
    private modalService: ModalService
  ) {}

  test: string = 'a';

  data: any = {
    transRegistered$: null,
    country$: null,
    province$: null,
    district$: null,
    subdistrict: null
  };

  projectAbout: any = {
    isCollapsed: false
  };

  feeType: any = {
    toggle: []
  };

  deliAddress: any = {
    that: {},
    formField: {
      address: '',
      country: {
        isLoading: false,
        selected: null
      },
      province: {
        isLoading: false,
        selected: null
      },
      district: {
        isLoading: false,
        selected: null
      },
      subdistrict: {
        isLoading: false,
        selected: null
      },
      postalCode: '',
      phoneNumber: ''
    },
    setValue(restore?: boolean) {
      if (this.that.data.transRegistered$.transDeliAddress.ID) {
        this.watchChange();

        if (!restore) {
          this.formField.address = '';
          this.formField.country.selected = null;
          this.formField.province.selected = null;
          this.formField.district.selected = null;
          this.formField.subdistrict.selected = null;
          this.formField.postalCode = '';
          this.formField.phoneNumber = '';
        }
        else {
          this.formField.address = this.that.data.transRegistered$.transDeliAddress.address;
          this.formField.phoneNumber = this.that.data.transRegistered$.transDeliAddress.phoneNumber;

          this.formField.country.isLoading = true;
          this.that.dataService.country.getList().then((result: Schema.Country[]) => {
            this.formField.country.isLoading = false;
            this.that.data.country$ = result;
            this.formField.country.selected = this.that.data.country$[this.that.data.country$.findIndex(k => k.ID === this.that.data.transRegistered$.transDeliAddress.country.ID)];

            this.getListProvince(true);
          });
        }
      }
    },
    getListProvince(restore?: boolean) {
      let countryID: string = (this.formField.country.selected ? this.formField.country.selected.ID : null);

      this.formField.province.isLoading = true;
      this.formField.district.isLoading = true;
      this.formField.subdistrict.isLoading = true;
      this.that.dataService.province.getList(countryID).then((result: Schema.Province[]) => {
        this.formField.province.isLoading = false;
        this.that.data.province$ = result;
        this.formField.province.selected = (restore ? this.that.data.province$[this.that.data.province$.findIndex(k => k.ID === this.that.data.transRegistered$.transDeliAddress.province.ID)] : null);

        this.getListDistrict(true);
      });
    },
    getListDistrict(restore?: boolean) {
      let countryID: string = (this.formField.country.selected ? this.formField.country.selected.ID : null);
      let provinceID: string = (this.formField.province.selected ? this.formField.province.selected.ID : null);

      this.formField.district.isLoading = true;
      this.formField.subdistrict.isLoading = true;
      this.that.dataService.district.getList(countryID, provinceID).then((result: Schema.District[]) => {
        this.formField.district.isLoading = false;
        this.that.data.district$ = result;
        this.formField.district.selected = (restore ? this.that.data.district$[this.that.data.district$.findIndex(k => k.ID === this.that.data.transRegistered$.transDeliAddress.district.ID)] : null);

        this.getListSubdistrict(true);
      });
    },
    getListSubdistrict(restore?: boolean) {
      let countryID: string = (this.formField.country.selected ? this.formField.country.selected.ID : null);
      let provinceID: string = (this.formField.province.selected ? this.formField.province.selected.ID : null);
      let districtID: string = null;
      let postalCode: string = '';

      if (this.formField.district.selected) {
        districtID = this.formField.district.selected.ID;
        postalCode = this.formField.district.selected.zipCode;
      }

      this.formField.postalCode = (restore ? this.that.data.transRegistered$.transDeliAddress.postalCode : postalCode);
      this.that.dataService.subdistrict.getList(countryID, provinceID, districtID).then((result: Schema.Subdistrict[]) => {
        this.formField.subdistrict.isLoading = false;
        this.that.data.subdistrict$ = result;
        this.formField.subdistrict.selected = (restore ? this.that.data.subdistrict$[this.that.data.subdistrict$.findIndex(k => k.ID === this.that.data.transRegistered$.transDeliAddress.subdistrict.ID)] : null);
      });
    },
    watchChange() {
      this.saveChange.isValid = true;
    },
    saveChange: {
      that: {},
      isSaving: false,
      isValid: true,
      validate(): boolean {
        if (!this.that.deliAddress.formField.address ||
            !this.that.deliAddress.formField.country.selected ||
            !this.that.deliAddress.formField.province.selected ||
            !this.that.deliAddress.formField.district.selected ||
            !this.that.deliAddress.formField.subdistrict.selected ||
            !this.that.deliAddress.formField.postalCode ||
            !this.that.deliAddress.formField.phoneNumber)
          return false;

        return true;
      },
      action() {
        this.isSaving = true;

        this.that.authService.getIsAuthenticated().then((result: boolean) => {
          if (!result) {
            this.isSaving = false;

            this.that.router.navigate(['SignIn']);
          }
          else {
            this.isValid = this.validate();

            if (this.isValid) {
                this.isSaving = false;
            }
            else
              this.isSaving = false;
          }
        });
      }
    }
  };

  ngOnInit() {
    this.data.transRegistered$ = this.route.snapshot.data.transRegistered$;

    if (!this.data.transRegistered$) {
      let modalRef = this.modalService.getModalError(false, ModalErrorComponent, 'registered.error.notFound');

      this.modalService.close(modalRef).then((result: string) => {
        if (result === 'close')
          this.router.navigate(['TransactionRegistered']);
      });
    }
    else {
      this.deliAddress.that = this;
      this.deliAddress.saveChange.that = this;

      this.deliAddress.setValue(true);
    }
  }
}