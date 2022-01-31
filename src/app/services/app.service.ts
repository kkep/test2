import data from '../../assets/data.json';
import {Injectable} from '@angular/core';
import {IDocument} from "../classes/IDocument";
import {Observable, timer} from "rxjs";
import {Sort} from "@angular/material/sort";
import {DocType} from "../enums/doc-type";
import {DocStatus} from "../enums/doc-status";

@Injectable({
  providedIn: 'root'
})
export class AppService{

  private serverData: IDocument[] = [];

  constructor() {
    this.serverData = data as IDocument[];
  }

  serverEmitter(page?: any, sortState?: Sort): Observable<any> {
    return new Observable((observer) => {
      let data = [...this.serverData];

      if (sortState) {
        data.sort((a: any, b: any) => {
          const direction = sortState.direction === 'asc' ? 1 : -1;
          const path = sortState.active.split('.');

          path.forEach((e) => {
            a = a[e] || '';
            b = b[e] || '';
          });
          if (a > b) {
            return direction;
          }
          if (a < b) {
            return -direction;
          }
          return 0;
        })
      }

      data.forEach((el, index) => {
        el.position = index+1;
      })

      const response = {
        data: data.slice(page.pageIndex, page.pageIndex + page.pageSize),
        total: this.serverData.length
      }
      timer(2000).subscribe(() => observer.next(response))
    })
  }


  private saveInServer(doc: IDocument) {
    doc.id = AppService.makeId(16);
    doc.docCode = AppService.makeId(32);
    doc.docDate = (new Date()).toISOString().split('T')[0];
    doc.status = DocStatus.REGISTERED;
    this.serverData.push(doc);
    return doc;
  }

  saveDocument(doc: IDocument): Observable<IDocument> {
    return new Observable((observer) => {
      observer.next(this.saveInServer(doc));
    });
  }

  private static makeId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  docTypeHumanize(type: string) {
    switch (type) {
      case DocType.REQUEST:
        return 'Заявление';
      case DocType.CERTIFICATE:
        return 'Справка';
      default:
        console.error(`Humanized document type for '${type}' is undefined`);
        return type;
    }
  }

  docStatusHumanize(status: string) {
    switch (status) {
      case DocStatus.REGISTERED:
        return 'Зарегистрировано';
      case DocStatus.ACCEPTED:
        return 'Рассмотрено';
      default:
        console.error(`Humanized document status for '${status}' is undefined`);
        return status;
    }
  }
}
