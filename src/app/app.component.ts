import {AfterViewInit, Component, ViewChild
} from '@angular/core';
import {AppService} from "./services/app.service";
import {IDocument} from "./classes/IDocument";
import {MatSort, MatSortable, Sort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {AddDialogComponent} from "./components/add-dialog/add-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatTable) table: MatTable<IDocument> | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined

  paginatorOptions = {
    length: 0,
    pageSize: 1,
    pageSizeOptions: [1, 5, 10, 25, 100],
    pageIndex: 0
  }

  sortState: Sort | undefined;

  displayedColumns: string[] = ['docName', 'docCode', 'docDate', 'docType', 'status', 'author.fio', 'author.post'];
  dataSource: MatTableDataSource<IDocument> = new MatTableDataSource();

  private subscription: Subscription | null = null;

  constructor(public appService: AppService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    const state = localStorage.getItem('sortState') || '';
    this.sortState = state ? JSON.parse(state) : undefined;
    if (this.sortState) {
      setTimeout(() => {
        this.sort?.sort({id: this.sortState?.active, start: this.sortState?.direction} as MatSortable)
      }, 0)
    } else {
      this.getData(this.paginator);
    }
  }

  getData(pagination: any, sortState?: Sort) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.appService.serverEmitter(pagination, sortState).subscribe((resp: {total: number, data: IDocument[]}) => {
      this.dataSource = new MatTableDataSource(resp.data);
      this.paginatorOptions.length = resp.total;
      this.subscription = null;
    });
  }

  openDialog(): void {
    this.dialog
      .open(AddDialogComponent)
      .afterClosed().subscribe(result => {
        if (result) {
          this.appService.saveDocument(result).subscribe((doc: IDocument) => {
            this.paginatorOptions.length++;
          });
        }
      });
  }

  setPage(event: PageEvent) {
    this.getData(event, this.sortState);
  }

  setSort(event: Sort) {
    this.paginator?.firstPage();
    this.sortState = event.direction ? event : undefined;
    if (this.sortState) {
      localStorage.setItem('sortState', JSON.stringify(this.sortState));
    } else {
      localStorage.removeItem('sortState');
    }
    this.getData({pageIndex: 0, pageSize: this.paginator?.pageSize}, this.sortState);
  }

}
