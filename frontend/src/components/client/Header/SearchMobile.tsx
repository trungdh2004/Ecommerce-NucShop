import { calculateTimeDistance, formatCurrency } from "@/common/func";
import { optimizeCloudinaryUrl } from "@/common/localFunction";
import useDebounce from "@/hooks/shared";
import { cn } from "@/lib/utils";
import { searchPopupService } from "@/service/system";
import { ISearchPopup } from "@/types/system";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";
type Props = {
	handleCloseSidebar: () => void;
};
const SearchMobile = ({ handleCloseSidebar }: Props) => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const [textKeyWord, setTextKeyWord] = useState<string>("");
	const [autocomplete, setAutocomplete] = useState<ISearchPopup | []>();
	const wrapperRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setTextKeyWord("");
				setAutocomplete([]);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const findSearch = useDebounce((keyword: string) => {
		(async () => {
			try {
				setLoading(true);
				const { data } = await searchPopupService({ keyword });
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
		setAutocomplete([]);
		handleCloseSidebar();
	};
	return (
		<div className="relative" ref={wrapperRef}>
			<div className="flex items-center px-1 py-1.5 border border-gray-200 rounded">
				<label className="" htmlFor="search-header">
					<IoSearch size={16} className="text-gray-400" />
				</label>
				<input
					onChange={(e) => handleSearch(e.target.value.trim())}
					id="search-header"
					type="text"
					placeholder="Tìm kiếm..."
					className="w-full mx-3 text-sm border-none outline-none"
				/>
			</div>
			<div
				className={cn(
					"absolute p-1 w-full bg-gray-100 rounded-md shadow-[rgba(0,0,0,0.25)_0px_5px_15px] mt-1.5 hidden",
					(textKeyWord?.length > 0 ||
						(autocomplete as ISearchPopup)?.listBlog?.length > 0 ||
						(autocomplete as ISearchPopup)?.listProduct?.length > 0) &&
						"block",
				)}
			>
				<div
					className={cn(
						"flex items-center gap-1 ",
						textKeyWord?.length <= 0 && "hidden",
					)}
				>
					{isLoading ? (
						<AiOutlineLoading3Quarters className="text-base text-gray-400 animate-spin" />
					) : (
						<MdOutlineSearch className="text-base text-gray-400" />
					)}

					<p
						className={cn("text-xs text-gray-400 min-w-0 w-full line-clamp-2")}
					>
						{autocomplete &&
						((autocomplete as ISearchPopup)?.listBlog?.length > 0 ||
							(autocomplete as ISearchPopup)?.listProduct?.length > 0)
							? "Kết quả cho"
							: "Không có kết quả cho"}{" "}
						'{textKeyWord}'
					</p>
				</div>
				<ul className=" *:py-1.5 *:px-1 *:rounded *:relative w-full max-h-80 overflow-y-auto scroll-custom ">
					<li
						className={cn(
							"hidden items-center justify-between border-b border-gray-100",
							(autocomplete as ISearchPopup)?.listProduct?.length > 0 && "flex",
						)}
					>
						<p className="text-sm font-medium text-black/85">Sản phẩm</p>
						<Link
							onClick={handleChangePath}
							to={`/search?topic=product&q=${encodeURIComponent(textKeyWord)}`}
							className="text-xs hover:text-custom"
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
										<div className="flex-grow w-full min-w-0">
											<p className="flex-grow w-full text-sm truncate">
												{product?.name}
											</p>
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
							className="text-sm hover:text-custom"
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
									<div className="flex items-start w-full min-w-0 gap-3">
										<div className="overflow-hidden rounded-full size-8 min-w-8 min-h-8">
											<img
												src={optimizeCloudinaryUrl(blog?.thumbnail_url, 44, 44)}
												alt=""
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="w-full min-w-0">
											<p className="flex-grow w-full min-w-0 text-sm truncate">
												{blog?.meta_title}
											</p>
											<p className="text-xs text-gray-400">
												{calculateTimeDistance(blog?.published_at)}
											</p>
										</div>
									</div>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default SearchMobile;
