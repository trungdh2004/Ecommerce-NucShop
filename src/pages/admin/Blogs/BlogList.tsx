import DialogConfirm from '@/components/common/DialogConfirm';
import Paginations from '@/components/common/Pagination';
import { TooltipComponent } from '@/components/common/TooltipComponent';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import instance from '@/config/instance';
import { deleteBlogBYId } from '@/service/blog';
import { getAllTags } from '@/service/tags-admin';
import { SearchObjectBlog } from '@/types/searchObjecTypes';
import { typeResponse } from '@/types/typeReponse';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEye, FaRegComment, FaRegHeart } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlinePublic, MdOutlinePublicOff } from 'react-icons/md';
import { SlOptionsVertical } from "react-icons/sl";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';

type IBlog = {
  _id?: string,
  title: string,
  content: string,
  isDeleted: string,
  createdAt: string,
  published_at: string,
  isPublish: boolean,
  user_id: {
    avatarUrl?: string,
    email: string,
    _id: string,
    full_name: string,
  },
  views_count: number,
  countLike: number,
  comments_count: number,
  thumbnail_url?: string,
  meta_description: string,
  tags: string,
}

const BlogList = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [response, setResponse] = useState<typeResponse>({
    pageCount: 0,
    totalElement: 0,
    totalOptionPage: 0,
  })
  const [searchObject, setSearchObject] = useState<SearchObjectBlog>({
    pageIndex: 1,
    pageSize: 9,
    keyword: "",
    fieldSort: "",
    sort: 1,
    tab: 1,
    tags: ""
  });
  const handleBlog = async () => {
    try {
      const { data } = await instance.post(`/blogs/pagingBlog`, searchObject);
      setBlogs(data.content);
      setResponse({
        pageCount: data.totalPage,
        totalElement: data.totalOptionPage,
        totalOptionPage: data.totalAllOptions,
      })
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    (async () => {
      handleBlog()
    })()
  }, [searchObject])
  const [tags, setTags] = useState<ITag[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await getAllTags();
      setTags(data.data)
    })()
  }, [])
  const handleChangePag = (value: any) => {
    setSearchObject((prev) => ({
      ...prev,
      pageIndex: value.selected + 1,
    }));
  }
  const debounced = useDebounceCallback((inputValue: string) => {
    setSearchObject((prev) => ({
      ...prev,
      pageIndex: 1,
      keyword: inputValue,
    }));
  }, 300);
  const [openDeleteBlog, setOpenDeleteBlog] = useState<string | boolean>(
    false,
  );
  const handleDeleteBlog = async (req: string | boolean) => {
    try {
      const { data } = await deleteBlogBYId(req);
      handleBlog();
      setOpenDeleteBlog(false);
      toast.success("Xóa bài viết thành công")
    } catch (error) {
      console.log(error)
    }
  }
  // console.log('openDelete', openDeleteBlog)
  return (
    <>
      <div className="">
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Bài viết</h3>

          </div>
          <div className="flex justify-between items-center gap-3">
            <div className=" w-[40%]">
              <Input
                placeholder="Tìm kiếm bài viết"
                className="w-[100%] md:text-base text-xs"
                onChange={(event) => debounced(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                className='w-[150px]'
                options={tags}
                placeholder="Bài viết"
                classNamePrefix="react-select"
                getOptionLabel={(option: ITag) => option.name}
                getOptionValue={(option: ITag) => option.slug as string}
                onChange={(values: ITag | null) => {
                  setSearchObject((prev: any) => ({ ...prev, tags: values ? values.slug : "" }))
                }}
              />
              <TooltipComponent label='Mặc định'>
                <div> <Button onClick={() => setSearchObject({
                  pageIndex: 1,
                  pageSize: 9,
                  keyword: "",
                  fieldSort: "",
                  sort: 1,
                  tab: 1,
                  tags: ""
                })} className='' variant="destructive"><GrPowerReset size={20} /></Button></div>
              </TooltipComponent>
            </div>
          </div>
        </div>
      </div>
      <Tabs value={`${searchObject.tab}`} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="1"
            onClick={() => setSearchObject((prev) => ({ ...prev, tab: 1, pageIndex: 1 }))}
          >
            Bài viết đã đăng tải
          </TabsTrigger>
          <TabsTrigger
            value="2"
            onClick={() => { setSearchObject((prev) => ({ ...prev, tab: 2, pageIndex: 1 })) }}
          >
            Bài viết chưa đăng tải
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-12 gap-6 xl:gap-8 mt-10">
        {blogs.length ? (
          blogs.map((item: IBlog, index: number) => (
            <>
              <div key={index} className="col-span-12 min-[600px]:col-span-6 min-[900px]:col-span-4 h-[360px] " >
                <div className="h-[350px] grid grid-rows-2 border rounded-xl overflow-hidden relative" >
                  {/* card-head */}
                  <div className="absolute z-10 top-4 right-2">
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <div className='cursor-pointer'>
                          <SlOptionsVertical size={20} color='white' />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='min-w-[10px] cursor-pointer' align='end'>
                        <DropdownMenuItem className='cursor-pointer'><Link className='w-full' to={`/admin/blogs/${item._id}/edit`}>Sửa</Link></DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer ' onClick={() => setOpenDeleteBlog(item?._id as any)} >Xóa</DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className=" bg-gray-200 border-b border-gray-300">
                    <img src={item.thumbnail_url || "/no-image.png"} className='w-full h-full object-cover' alt="" />
                  </div>
                  {/* card-content */}
                  <div className="px-4 pt-2">
                    <div className="flex items-center gap-1 pb-2">
                      <img src={item.user_id?.avatarUrl || "/avatar_25.jpg"} className='w-[40px] h-[40px] border-[3px] border-white rounded-full' alt="" />
                      <div className="">
                        <h3 className="text-sm font-medium">{item.user_id?.full_name}</h3>
                        <p className="text-xs text-[#212B36] opacity-50 ">{format(item.published_at || item.createdAt || "", "dd-MM-yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Link to={`/admin/blogs/${item._id}`} className="line-clamp-1 text-[#212B36] text-[18px] font-semibold hover:underline transition-all duration-300">{item.title || "Bài viết chưa có tiêu đề"}</Link>
                      <span className=""> {item.isPublish ? <MdOutlinePublic size={22} className='text-blue-500' /> : <MdOutlinePublicOff size={22} />}</span>
                    </div>
                    <p className="text-xs pt-1 text-gray-400 line-clamp-2">{item.meta_description}</p>
                    <div className="flex space-x-4 min-[900px]:space-x-1 xl:space-x-4 absolute bottom-4 right-4">

                      <div className="flex gap-3">
                        <span className="text-[#212B36] text-xs flex items-center gap-1"><FaRegHeart size={16} />{item.countLike}</span>

                        <span className="text-[#212B36] text-xs flex items-center gap-1"><FaRegComment size={16} />{item.comments_count}</span>
                        <span className="text-[#212B36] text-xs flex items-center gap-1"> <FaEye size={16} />{item.views_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="col-span-12 min-h-[360px] flex justify-center items-center">
            <h3 className="text-lg">Không có bài viết!</h3>
          </div>
        )}
      </div >
      <div className="flex justify-center mt-5">

        <Paginations forcePage={searchObject.pageIndex - 1} pageCount={response.pageCount} handlePageClick={handleChangePag} />
      </div>
      {!!openDeleteBlog && (
        <DialogConfirm
          open={!!openDeleteBlog}
          title='Xóa bài viết'
          handleClose={() => setOpenDeleteBlog(false)}
          handleSubmit={() => handleDeleteBlog(openDeleteBlog)}
          content='Bạn có chắc chắn muốn xóa bài viết này không?'
          labelConfirm='Xóa'
        />
      )}
    </>
  )
}

export default BlogList