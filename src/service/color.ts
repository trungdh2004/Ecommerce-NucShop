import instance from "@/config/instance"

export const hiddenListColor = async (listId: any) => {
    const data = await instance.put(`/color/deleteMany`, { listId });
    return data;
}
export const unHiddenListColor = async (listId: any) => {
    const data = await instance.put(`/color/unDeleteMany`, { listId });
    return data;
}

export const getAllColor = () => instance.get("/color/getAll")