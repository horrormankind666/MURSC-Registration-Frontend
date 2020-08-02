/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๖/๒๕๖๓>
Modify date : <๓๑/๐๗/๒๕๖๓>
Description : <>
=============================================
*/

'use strict';

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AppService} from '../../../app.service';
import {AuthService} from '../../../auth.service';
import {Schema, DataService} from '../../../data.service';
import {ModalService} from '../../../modal/modal.service';

import {ModalErrorComponent, ModalConfirmComponent} from '../../../modal/modal.component';

@Component({
  selector: 'app-transaction-registered-detail',
  templateUrl: './transaction-registered-detail.component.html',
  styleUrls: ['./transaction-registered-detail.component.scss']
})
export class TransactionRegisteredDetailComponent implements OnInit {
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
      this.saveChange.errorCode = 0;
    },
    saveChange: {
      that: {},
      isSaving: false,
      isValid: true,
      errorCode: 0,
      getValue(): {} {
        let result: {} = {
          transDeliAddressID: (this.that.data.transRegistered$.transDeliAddress.ID ? this.that.data.transRegistered$.transDeliAddress.ID : null),
          transRegisteredID: (this.that.data.transRegistered$.ID ? this.that.data.transRegistered$.ID : null),
          deliAddress: {
            address: (this.that.deliAddress.formField.address ? this.that.deliAddress.formField.address : null),
            country: (this.that.deliAddress.formField.country.selected ? this.that.deliAddress.formField.country.selected.ID : null),
            province: (this.that.deliAddress.formField.province.selected ? this.that.deliAddress.formField.province.selected.ID : null),
            district: (this.that.deliAddress.formField.district.selected ? this.that.deliAddress.formField.district.selected.ID : null),
            subdistrict: (this.that.deliAddress.formField.subdistrict.selected ? this.that.deliAddress.formField.subdistrict.selected.ID : null),
            postalCode: (this.that.deliAddress.formField.postalCode ? this.that.deliAddress.formField.postalCode : null),
            phoneNumber: (this.that.deliAddress.formField.phoneNumber ? this.that.deliAddress.formField.phoneNumber : null)
          }
        };

        return (result ? result : null);
      },
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

            this.that.appService.gotoSignIn();
          }
          else {
            this.isValid = this.validate();

            if (this.isValid) {
              let value: {} = this.getValue();

              this.that.appService.save('TransDeliveryAddress', 'PUT', JSON.stringify(value), false).then((result: any) => {
                let saveResult: any = result;
                let message: string;
                let modalRef: any;

                this.isSaving = false;
                this.errorCode = saveResult.errorCode;

                if (this.errorCode !== 0 && this.errorCode !== 1) {
                  if (this.errorCode === 2) message = ('registered.error.notFound');

                  modalRef = this.that.modalService.getModalError(false, ModalErrorComponent, message);

                  this.that.modalService.close(modalRef).then((result: string) => {
                    if (result === 'close') {
                        if (this.errorCode === 2)
                          this.that.router.navigate(['TransactionRegistered']);
                    }
                  });
                }
                else {
                  if (this.errorCode === 0) {
                    this.that.data.transRegistered$.transDeliAddress.address      = this.that.deliAddress.formField.address;
                    this.that.data.transRegistered$.transDeliAddress.country      = this.that.deliAddress.formField.country.selected;
                    this.that.data.transRegistered$.transDeliAddress.province     = this.that.deliAddress.formField.province.selected;
                    this.that.data.transRegistered$.transDeliAddress.district     = this.that.deliAddress.formField.district.selected;
                    this.that.data.transRegistered$.transDeliAddress.subdistrict  = this.that.deliAddress.formField.subdistrict.selected;
                    this.that.data.transRegistered$.transDeliAddress.postalCode   = this.that.deliAddress.formField.postalCode;
                    this.that.data.transRegistered$.transDeliAddress.phoneNumber  = this.that.deliAddress.formField.phoneNumber;
                  }
                }
              });
            }
            else
              this.isSaving = false;
          }
        });
      }
    }
  };

  payment: any = {
    that: {},
    formField: {
      issueReceipt: '',
      qrcodeImage: ''
    },
    setValue(restore?: boolean) {
      this.watchChange();

      if (!restore) {
        this.formField.issueReceipt = '';
        this.formField.qrcodeImage = '';
      }
      else {
        this.formField.issueReceipt = (this.that.data.transRegistered$.invoice.payment.status !== 'N' ? this.that.data.transRegistered$.invoice.namePrintReceipt : (this.that.authService.getUserInfo.fullName.th ? this.that.authService.getUserInfo.fullName.th : this.that.authService.getUserInfo.fullName[this.that.appService.lang]));
        this.formField.qrcodeImage = (this.that.data.transRegistered$.invoice.payment.status === 'W' ? this.that.data.transRegistered$.invoice.qrImage : '');
      }
    },
    watchChange() {
      this.saveChange.isValid = true;
      this.saveChange.errorCode = 0;
    },
    saveChange: {
      that: {},
      isSaving: false,
      isValid: true,
      errorCode: 0,
      getValue(): {} {
        let result: {} = {
          transRegisteredID: (this.that.data.transRegistered$.ID ? this.that.data.transRegistered$.ID : null),
          transProjectID: (this.that.data.transRegistered$.transProject.ID ? this.that.data.transRegistered$.transProject.ID : null),
          issueReceipt: (this.that.payment.formField.issueReceipt ? this.that.payment.formField.issueReceipt : null)
        };

        return (result ? result : null);
      },
      validate(): boolean {
        if (!this.that.payment.formField.issueReceipt)
          return false;

        return true;
      },
      action() {
        this.isSaving = true;

        this.that.authService.getIsAuthenticated().then((result: boolean) => {
          if (!result) {
            this.isSaving = false;

            this.that.appService.gotoSignIn();
          }
          else {
            this.isValid = this.validate();

            if (this.isValid) {
              let modalRef = this.that.modalService.getModalConfirm(false, ModalConfirmComponent, 'payment.save.confirm.label', 'payment.save.confirm.description');

              this.that.modalService.close(modalRef).then((result: string) => {
                if (result === 'ok') {
                  this.that.dataService.transRegistered.get(this.that.appService.getCUID([this.that.data.transRegistered$.ID, this.that.data.transRegistered$.transProject.ID])).then((result: Schema.TransRegistered) => {
                    let transRegistered: Schema.TransRegistered = result;

                    if (this.that.data.transRegistered$.invoice.payment.status !== transRegistered.invoice.payment.status)
                      this.that.data.transRegistered$ = transRegistered;

                    if (this.that.data.transRegistered$.invoice.payment.status === 'N') {
                      let value: {} = this.getValue();

                      this.that.appService.save(('QRCodePayment/' + this.that.data.transRegistered$.transProject.project.category.initial), 'PUT', JSON.stringify(value), false).then((result: any) => {
                        let saveResult: any = result;
                        let message: string;
                        let modalRef: any;

                        this.isSaving = false;
                        this.errorCode = saveResult.errorCode;

                        if (this.errorCode !== 0 && this.errorCode !== 1) {
                          if (this.errorCode === 2) message = ('registered.error.notFound');

                          modalRef = this.that.modalService.getModalError(false, ModalErrorComponent, message);

                          this.that.modalService.close(modalRef).then((result: string) => {
                            if (result === 'close') {
                                if (this.errorCode === 2)
                                  this.that.router.navigate(['Transaction/Registered']);
                            }
                          });
                        }
                        else {
                          if (this.errorCode === 0) {
                            this.that.data.transRegistered$.invoice.merchantName = saveResult.merchantName;
                            this.that.data.transRegistered$.invoice.qrRef1 = saveResult.qrRef1;
                            this.that.data.transRegistered$.invoice.qrRef2 = saveResult.qrRef2;
                            this.that.data.transRegistered$.invoice.qrRef3 = saveResult.qrRef3;
                            this.that.data.transRegistered$.invoice.payment.amount = saveResult.paidAmount;
                            this.that.data.transRegistered$.invoice.payment.confirmDate = saveResult.actionDate;
                            this.that.data.transRegistered$.invoice.payment.status = saveResult.paidStatus;
                            this.that.payment.formField.qrcodeImage = saveResult.qrImage64;
                          }
                        }
                      });
                    }
                    else {
                      this.isSaving = false;

                      this.that.payment.setValue(true);
                    }
                  });
                }
                else
                  this.isSaving = false;
              });
            }
            else
              this.isSaving = false;
          }
        });
      }
    }
  }

  ngOnInit() {
    this.data.transRegistered$ = this.route.snapshot.data.transRegistered$;

    if (!this.data.transRegistered$) {
      let modalRef = this.modalService.getModalError(false, ModalErrorComponent, 'registered.error.notFound');

      this.modalService.close(modalRef).then((result: string) => {
        if (result === 'close')
          this.router.navigate(['Transaction/Registered']);
      });
    }
    else {
      this.deliAddress.that = this;
      this.deliAddress.saveChange.that = this;
      this.deliAddress.setValue(true);

      this.payment.that = this;
      this.payment.saveChange.that = this;
      this.payment.setValue(true);
    }
  }

  getRecheckPayment() {
    this.appService.isLoading.show = true;
    this.appService.isLoading.checking = true;

    this.authService.getIsAuthenticated().then((result: boolean) => {
      if (!result) {
        this.appService.isLoading.show = false;
        this.appService.isLoading.checking = false;

        this.appService.gotoSignIn();
      }
      else {
        this.dataService.transRegistered.get(this.appService.getCUID([this.data.transRegistered$.ID, this.data.transRegistered$.transProject.ID])).then((result: Schema.TransRegistered) => {
          let transRegistered: Schema.TransRegistered = result;

          if (this.data.transRegistered$.invoice.payment.status !== transRegistered.invoice.payment.status) {
            this.data.transRegistered$ = transRegistered;

            if (this.data.transRegistered$.invoice.payment.status === 'N') {
              this.deliAddress.setValue(true);
              this.payment.setValue(true);
            }
          }

          this.appService.isLoading.show = false;
          this.appService.isLoading.checking = false;
        });
      }
    });
  }
}