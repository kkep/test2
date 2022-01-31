import {IAuthor} from "./IAuthor";
import {DocType} from "../enums/doc-type";
import {DocStatus} from "../enums/doc-status";

export interface IDocument {
  position: number;
  id: string;
  author: IAuthor;
  docCode: string;
  docDate: string | Date;
  docName: string;
  docType: DocType;
  address: string;
  status: DocStatus;
  isSpecial: boolean;
}
