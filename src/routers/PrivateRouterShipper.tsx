import LoadingFixed from '@/components/LoadingFixed';
import { useAuth } from '@/hooks/auth';
import { getCurrentShipper } from '@/service/shipper';
import useStoreShipper from '@/store/useCurrentShipper';
import { AxiosError } from 'axios';
import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
type PrivateRouterType = {
	children: ReactNode;
};
const PrivateRouterShipper = ({ children }: PrivateRouterType) => {
	const router = useNavigate()
    const { authUser, isLoggedIn } = useAuth();
	const [isLoading,setIsLoading] = useState(true);
	const {setCurrent} = useStoreShipper()

	if (!isLoggedIn) {
		return <Navigate to={"/auth/login"} />;
	}
	if (!authUser?.is_shipper) {
		return <Navigate to={"/"} />;
	}

	useEffect(() => {
		(
			async () => {
				try {
					const {data} = await getCurrentShipper()
					setCurrent(data.current)
					setIsLoading(false)
				} catch (error) {
					if (error instanceof AxiosError) {
						if(error.response?.data) {
							const data = error.response?.data
							if(data?.type === 1) {
								router("/shipper/auth")
							}else if(data?.type === 2) {
								router("/shipper/pending")
							}else if(data?.type === 3) {
								toast.error(data.message)
								router("/")
							}
							else {
								router("/")
							}
						}
					}
				}
			}
		)()
	},[])

	if(isLoading) {
		return <LoadingFixed />
	}
	return isLoggedIn && children;
}

export default PrivateRouterShipper