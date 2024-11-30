import instance from "@/config/instance"
import { ISearchObjectPayment } from "./searchObjecTypes"

export const fetchPayments = (searchObject: ISearchObjectPayment) => {
  const uri = `/payment/pagingPaymentClient`
  return instance.post(uri, searchObject)
}