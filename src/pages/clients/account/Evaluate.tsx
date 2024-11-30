import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import StarRatings from 'react-star-ratings' // Thư viện react-star-ratings
import { evaluate } from '@/service/evaluate'
import { IEvaluate } from '@/types/evaluate'



// Schema validation
const FormSchema = z.object({
  rating: z.number().min(1, 'Vui lòng đánh giá chất lượng!'),
  content: z.string().min(3, 'Nội dung quá ngắn'),
});

type Props = {
  open: string[] | null,
  handleClose: () => void,
  handleFetchOrder?: () => void,
}

const Evaluate = ({ open, handleClose }: Props) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0); // State để lưu số sao đã chọn
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: '',
    }
  })
  // const form = useForm()
  const mutation = useMutation({
    mutationFn: async (data: IEvaluate) => {
      return await evaluate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['purchase']
      })
      toast.success('Cảm ơn bạn đã đánh giá!');
      handleClose();
    },
    onError: () => {
      toast.error('Đã xảy ra lỗi!');
    },
  });
  // const { isSubmitted } = form.formState; // Kiểm tra form đã được submit hay chưa
  const onSubmit = (data: any) => {
    console.log("dât", open);
    mutation.mutate({ ...data, listId: open });
  }
  return (
    <>
      <Dialog open={!!open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className='text-center'>Đánh giá sản phẩm</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className=''>
                      <FormLabel className='pr-3'>Chất lượng sản phẩm:</FormLabel>
                      <FormControl>
                        <StarRatings
                          rating={field.value}
                          starRatedColor="#f97316 "
                          starHoverColor="#f97316 "
                          changeRating={(newRating) => field.onChange(+newRating)}
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="5px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung:</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hãy chia sẻ nhận cho sản phẩm này bạn nhé!" {...field} className='h-[200px] after:outline-none' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className='w-full bg-red-500 py-3 text-sm md:text-base uppercase text-white rounded-sm' >
                  Đánh giá
                </Button>
              </form>
            </Form>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Evaluate;
