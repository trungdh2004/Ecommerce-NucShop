import React from 'react'

import SimpleBarChart from '@/components/common/Chart';
import { Button } from '@/components/ui/button';

const UserDetail = () => {
  return (
		<div className="w-full grid lg:grid-cols-8 grid-cols-1 gap-8">
			<div className="grid lg:col-span-6 col-span-1 lg:order-1 order-2">
        <div className="w-full h-[350px]">
          <SimpleBarChart/>
        </div>
				<div className="pt-4 w-full">
					{/* <DataTableDemo /> */}
				</div>
			</div>
			<div className="grid lg:col-span-2 col-span-1 border rounded-md h-[440px] my-5 lg:order-2 order-1">
				<div className="flex flex-col gap-4 justify-center px-4">
					<h4 className="text-center font-medium text-[24px]">
						Thông tin cá nhân
					</h4>
					<div className="w-full">
						<img
							src="https://picsum.photos/200"
							alt=""
							className="w-full h-[150px] rounded-md"
						/>
					</div>
					<div className="flex gap-1">
						<h5 className="font-medium">Họ và tên : </h5>
						<span> Nguyễn Văn Tuyên</span>
					</div>
					<div className="flex gap-1">
						<h5 className="font-medium">Email : </h5>
						<span> vantuyenfpl@gmail.com</span>
					</div>
					<div className="flex gap-1">
						<h5 className="font-medium">Ngày đăng ký : </h5>
						<span> 20/12/2023</span>
          </div>
          
          <Button className='bg-[#da4040] hover:bg-[#ce6969]'>Cấm</Button>
				</div>
			</div>
		</div>
	);
}

export default UserDetail