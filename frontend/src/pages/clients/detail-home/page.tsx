import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IProductDetail } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../../../service/product";
import Ablum from "./Ablum";
import InfoProduct from "./InfoProduct";
import ProductDetailsAndReviews from "./ProductDetailsAndReviews";
import ProductRelated from "./ProductRelated";
import { useState } from "react";
import NotFound from "@/pages/NotFound";

const DetailProduct = () => {
	const { slug } = useParams();
	const [productRelated, setProductRelated] = useState([]);
	const { data, isLoading } = useQuery<IProductDetail>({
		queryKey: ["GET_PRODUCT_BY_SLUG", slug],
		queryFn: async () => {
			const { data } = await getProductBySlug(
				encodeURIComponent(slug as string),
			);
			setProductRelated(data?.listProductOther);
			return data?.data;
		},
	});

	if (!isLoading && Object.keys(data || {})?.length <= 0) {
		return <NotFound />;
	}
	return (
		<div className="">
			<div className="padding ">
				<Breadcrumb className="py-3">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/shop">Sản phẩm</BreadcrumbLink>
						</BreadcrumbItem>
						{data?.category?.name && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<div>
										<Link to={`/shop?category=${data?.category?._id}`}>
											<BreadcrumbLink>{data?.category?.name}</BreadcrumbLink>
										</Link>
									</div>
								</BreadcrumbItem>
							</>
						)}
						{data?.name && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage className="truncate max-w-52">
										{data?.name}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</>
						)}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="flex items-start bg-white max-md:flex-col md:gap-4 lg:gap-8 box-shadow">
					<div className="w-2/5 max-md:w-full">
						<Ablum images={data?.images} isLoading={isLoading} />
					</div>
					<div className="w-full md:flex-1">
						<InfoProduct product={data} />
					</div>
				</div>
				<div className="">
					<ProductDetailsAndReviews product={data} />
				</div>
				<div className="">
					<ProductRelated product={productRelated} />
				</div>
			</div>
		</div>
	);
};

export default DetailProduct;
