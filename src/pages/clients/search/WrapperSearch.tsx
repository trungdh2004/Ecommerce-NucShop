import useDebounce from "@/hooks/shared";
import { cn } from "@/lib/utils";
import { searchDetailPageService } from "@/service/system";
import { IBlogSearch } from "@/types/blogs";
import { IProductSearch } from "@/types/product";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Outlet, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import SearchProductPage from "./SearchProductPage";
import SearchPostsPage from "./SearchPostsPage";

interface IDataSearchDetailPage {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalOptionPage: number;
  totalAllOptions: number;
  content: IProductSearch[] | IBlogSearch[] | [];
}

const listTopic = [
  { topic: "product", name: "Sản phẩm" },
  { topic: "blog", name: "Bài viết" },
];

const WrapperSearch = () => {
  const [SearchParams, setSearchParams] = useSearchParams();
  const [topic, setTopic] = useState(() => SearchParams.get("topic") || "product");
  const [query, setQuery] = useState(SearchParams.get("q") || "");
  const [dataSearch, setDataSearch] = useState<IDataSearchDetailPage>({
    content: [],
    pageIndex: 1,
    pageSize: 0,
    totalAllOptions: 0,
    totalOptionPage: 0,
    totalPage: 0,
  });

  const fetchSearchResults = async (keyword: string, searchTopic: string, pageIndex = 1) => {
    try {
      const { data } = await searchDetailPageService({
        keyword,
        type: searchTopic,
        pageIndex,
      });
      setDataSearch((prevData) => ({
        ...data,
        content: pageIndex === 1 ? data.content : [...prevData.content, ...data.content],
      }));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      }
    }
  };

  useEffect(() => {
    const topicFromParams = SearchParams.get("topic") || "product";
    const qFromParams = SearchParams.get("q") || "";
    setTopic(topicFromParams);
    setQuery(qFromParams);
    fetchSearchResults(qFromParams, topicFromParams);
  }, [SearchParams]);

  const handleSearch = useDebounce((keyword: string) => {
    setSearchParams({ topic, q: keyword });
    fetchSearchResults(keyword, topic);
  }, 700);

  const handleClickActive = (selectedTopic: string) => {
    setSearchParams({ topic: selectedTopic, q: query });
    setTopic(selectedTopic);
  };

  const handleNextPage = async () => {
    fetchSearchResults(query, topic, dataSearch.pageIndex + 1);
  };

  return (
    <div className="mb-10 padding">
      <h1 className="mb-4 text-xl font-bold">Tìm kiếm</h1>

      <div className="mb-8">Tìm kiếm khóa học, bài viết và các video...</div>

      <div className="w-full border-b border-gray-300">
        <input
          onChange={(e) => {handleSearch(e.target.value);setQuery(e.target.value);}}
          type="text"
          value={query}
          placeholder=""
          className="block w-full p-3 text-xl bg-transparent outline-none"
        />
      </div>

      <div className="flex py-3 mb-8 space-x-4">
        {listTopic.map((t) => (
          <div
            onClick={() => handleClickActive(t.topic)}
            key={t.topic}
            className={cn(
              "pb-1 font-semibold",
              topic === t.topic
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            )}
          >
            {t.name}
          </div>
        ))}
      </div>

      <div>
        <InfiniteScroll
          dataLength={dataSearch?.content?.length}
          next={handleNextPage}
          hasMore={dataSearch.pageIndex < dataSearch.totalPage}
          loader={<p className="text-sm text-center text-gray-400">Loading...</p>}
          endMessage={<p style={{ textAlign: "center" }}></p>}
        >
          <div className={cn("grid gap-5",topic === "product" ? "grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
            {dataSearch.content.map((item) =>
              topic === "product" ? (
                <SearchProductPage product={item as IProductSearch} key={item?._id} />
              ) : (
                <SearchPostsPage key={item?._id} blog={item as IBlogSearch} />
              )
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default WrapperSearch;
