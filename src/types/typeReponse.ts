export interface typeResponse {
  pageCount: number;
  totalElement: number; //tổng số phần tử
  totalOptionPage: number;
}
export interface IResopnsePayment {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalOptionPage?: number;
  totalAllOptions?: number;
}