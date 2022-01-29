import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DocType} from "../../enums/doc-type";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {

  formGroup: FormGroup;
  DocType = DocType;

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    formBuilder: FormBuilder
  ) {
    this.formGroup = formBuilder.group({
      id: '',
      docCode: '',
      docDate: '',
      docName: new FormControl(''),
      docType: new FormControl(DocType.REQUEST),
      address: new FormControl(''),
      author: formBuilder.group({
        account: new FormControl(''),
        fio: new FormControl(''),
        post: new FormControl('')
      }),
      isSpecial: new FormControl(false)
    })
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
