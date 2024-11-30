import instance from "@/config/instance";
import { SearchObjectType } from "@/types/searchObjecTypes";

export const pagingUser = async (searchObject:SearchObjectType) => {
	const data = await instance.post("/admin/list-user", searchObject);
	return data;
};

export const banUser = async (openBanId : string) =>{
  const data = await instance.put(
		`auth/blocked/${openBanId}`,
		{ type: 1 },
  );
  return data
  
}

export const unBanUser = async (openUnbanId: string) => {
	const data = await instance.put(
		`auth/unblocked/${openUnbanId}`,
		{ type: 1 },
	);
	return data;
};


export const unBanManyUser = async (listId: any) => {
  const data = await instance.put(`auth/unBlockedMany`, {
		listId: listId,
		type: 1,
	});
	return data;
};

export const BanManyUser = async (listId: any) => {
  const data = await instance.put(`auth/blockedMany`, {
    listId:listId,
		type: 1,
	});
	return data;
};