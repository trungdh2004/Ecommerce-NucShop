import { optimizeCloudinaryUrl } from "@/common/localFunction";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import useDebounce from "@/hooks/shared";
import { searchPopupService } from "@/service/system";
import { ISearchPopup } from "@/types/system";
import { AxiosError } from "axios";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCurrency } from "../../../../../server/src/config/func";
import { calculateTimeDistance } from "@/common/func";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
const Search = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [textKeyWord, setTextKeyWord] = useState<string>("");
	const [autocomplete, setAutocomplete] = useState<ISearchPopup | []>();
	const findSearch = useDebounce((keyword: string) => {
		(async () => {
			try {
				setLoading(true);
				const { data } = await searchPopupService({ keyword });
				const fakeData = {
					listBlog: data?.listBlog || [],
					listProduct:data?.listProduct || [],
				}
				setAutocomplete(data);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data.message);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, 700);
	const handleSearch = (keyword: string) => {
		setTextKeyWord(keyword);

		keyword?.length > 0
			? findSearch(keyword)
			: setAutocomplete({
					listBlog: [],
					listProduct: [],
				});
	};
	const handleChangePath = () => {
		setIsOpen(false);
		setAutocomplete([]);
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className="hover:bg-[#919eab27] p-1 rounded-full">
					<IoIosSearch strokeWidth={0.5} size={20} />
				</div>
			</DialogTrigger>
			<DialogContent className="max-sm:max-w-[92%] rounded-md max-w-lg">
				<DialogHeader className="pb-3 border-b border-gray-300">
					<div className="flex items-center">
						<label className="" htmlFor="search-header">
							<IoSearch size={24} className="text-gray-400" />
						</label>
						<input
							onChange={(e) => handleSearch(e.target.value.trim())}
							id="search-header"
							type="text"
							placeholder="Tìm kiếm..."
							className="w-full mx-3 border-none outline-none"
						/>
					</div>
				</DialogHeader>
				<div
					className={cn(
						"flex items-center gap-1",
						textKeyWord?.length <= 0 && "hidden",
					)}
				>
					{isLoading ? (
						<AiOutlineLoading3Quarters className="text-lg text-gray-400 animate-spin" />
					) : (
						<MdOutlineSearch className="text-lg text-gray-400" />
					)}

					<p className={cn("text-sm text-gray-400")}>
						{autocomplete &&
						((autocomplete as ISearchPopup)?.listBlog?.length > 0 ||
							(autocomplete as ISearchPopup)?.listProduct?.length > 0)
							? "Kết quả cho"
							: "Không có kết quả cho"}{" "}
						'{textKeyWord}'
					</p>
				</div>
				<ul className=" *:py-1.5 *:px-1 *:rounded *:relative w-full max-h-80 overflow-y-auto scroll-custom">
					<li
						className={cn(
							"hidden items-center justify-between border-b border-gray-200",
							(autocomplete as ISearchPopup)?.listProduct?.length > 0 && "flex",
						)}
					>
						<p className="text-base font-medium text-black/85">Sản phẩm</p>
						<Link
						onClick={handleChangePath}
							to={`/search?topic=product&q=${encodeURIComponent(textKeyWord)}`}
							className="hover:text-blue-500 text-sm"
						>
							Xem thêm
						</Link>
					</li>
					{Array.isArray((autocomplete as any)?.listProduct) &&
						(autocomplete as ISearchPopup)?.listProduct?.map((product) => (
							<li className="hover:bg-gray-100 ">
								<Link
									to={`/shop/detail/${decodeURI(product?.slug)}`}
									onClick={handleChangePath}
									className="block"
								>
									<div className="flex items-start gap-3">
										<div className="overflow-hidden rounded-full size-8 min-w-8 min-h-8">
											<img
												src={optimizeCloudinaryUrl(product?.thumbnail, 44, 44)}
												alt=""
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="flex-grow">
											<p className="flex-grow text-sm truncate max-w-36 md:max-w-sm">{product?.name}</p>
											<p className="text-xs text-red-500">
												{formatCurrency(product?.price)}
											</p>
										</div>
									</div>
								</Link>
							</li>
						))}
					<li
						className={cn(
							"hidden items-center justify-between border-b border-gray-200",
							(autocomplete as ISearchPopup)?.listBlog?.length > 0 && "flex",
						)}
					>
						<p className="text-base font-medium text-black/85">Bài viết</p>
						<Link
						onClick={handleChangePath}
							to={`/search?topic=blog&q=${encodeURIComponent(textKeyWord)}`}
							className="hover:text-blue-500 text-sm"
						>
							Xem thêm
						</Link>
					</li>
					{Array.isArray((autocomplete as any)?.listBlog) &&
						(autocomplete as ISearchPopup)?.listBlog?.map((blog) => (
							<li className="hover:bg-gray-100 ">
								<Link
									to={`/blogDetail/${blog?._id}`}
									onClick={handleChangePath}
									className="block"
								>
									<div className="flex items-start gap-3">
										<div className="overflow-hidden rounded-full size-8 min-w-8 min-h-8">
											<img
												src={optimizeCloudinaryUrl(blog?.thumbnail_url, 44, 44)}
												alt=""
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="">
											<p className="flex-grow text-sm truncate max-w-36 md:max-w-sm">{blog?.meta_title}</p>
											<p className="text-xs text-gray-400">
												{calculateTimeDistance(blog?.published_at)}
											</p>
										</div>
									</div>
								</Link>
							</li>
						))}
				</ul>
			</DialogContent>
		</Dialog>
	);
};

export default Search;
