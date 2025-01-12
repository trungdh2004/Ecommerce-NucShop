interface IPagingProps {
  pageIndex: number;
  limit: number;
  data: any;
  count: number;
}

export const formatDataPaging = ({
  limit,
  pageIndex,
  data,
  count,
}: IPagingProps) => {
  const totalPage = count === 0 ? 0 : Math.ceil(count / limit);
  const totalOptionPage = data.length;
  const totalAllOptions = count;

  return {
    pageIndex: pageIndex,
    pageSize: limit,
    totalPage,
    totalOptionPage,
    totalAllOptions,
    content: data,
  };
};
