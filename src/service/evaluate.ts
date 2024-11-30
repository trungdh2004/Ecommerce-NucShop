import instance from "@/config/instance"
import { IEvaluate } from "@/types/evaluate"

export const evaluate = (response: IEvaluate) => {
  const uri = `/evaluate/create`
  return instance.post(uri, response)
}