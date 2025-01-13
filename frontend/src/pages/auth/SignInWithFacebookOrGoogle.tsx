import { setItemLocal } from "@/common/localStorage";
import app from "@/config/initializeFirebase";
import instance from "@/config/instance";
import { useAuth } from "@/hooks/auth";
import { useRouterHistory } from "@/hooks/router";
import { socialUser } from "@/service/account";
import { getCountMyShoppingCart, pagingCartV2 } from "@/service/cart";
import useCart from "@/store/cart.store";
import { AxiosError } from "axios";
import {
	GoogleAuthProvider,
	getAdditionalUserInfo,
	getAuth,
	signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
const SignInWithFacebookOrGoogle = () => {
	const auth = getAuth(app);
	const { setAuthUser, setIsLoggedIn } = useAuth();
	const routerHistory = useRouterHistory();
	const { setCarts, setTotalCart } = useCart();
	const handleLoginGoogle = async () => {
		const provider = new GoogleAuthProvider();
		provider.addScope("https://www.googleapis.com/auth/userinfo.email");

		signInWithPopup(auth, provider)
			.then(async (result) => {
				const user = getAdditionalUserInfo(result);
				const payload = {
					email: user?.profile?.email,
					first_name: user?.profile?.given_name,
					last_name: user?.profile?.family_name,
					full_name: user?.profile?.name,
					picture: user?.profile?.picture,
					uid: user?.profile?.id,
					provider: user?.providerId,
				};
				socialUser(payload)
					.then(async ({ data }) => {
						console.log(data);
						setAuthUser?.(data?.user);
						setIsLoggedIn?.(true);
						instance.defaults.headers.common.Authorization = `Bearer ${data?.accessToken}`;
						const [cartsResponse, totalCountResponse] = await Promise.all([
							pagingCartV2(),
							getCountMyShoppingCart(),
						]);
						setCarts(cartsResponse?.data?.listData || []);
						setTotalCart(totalCountResponse?.data?.count || 0);
						setItemLocal("token", data?.accessToken);
						routerHistory();
					})
					.catch((error) => {
						if (error instanceof AxiosError) {
							toast.error(error.response?.data?.message);
						}
					});
				// IdP data available using getAdditionalUserInfo(result)
			})
			.catch(() => {
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// // The email of the user's account used.
				// const email = error.customData.email;
				// // The AuthCredential type that was used.
				// const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-6 gap-x-4 *:border *:border-gray-200 *:rounded-lg  ">
				<div
					className="flex items-center justify-center col-span-6 gap-3 p-2 cursor-pointer max-h-10 hover:bg-gray-100"
					onClick={handleLoginGoogle}
				>
					<FcGoogle size={24} />
					<span className="text-sm">Đăng nhập với Google</span>
				</div>
			</div>
			{/* line */}
			<div className="grid grid-cols-6 gap-x-4 *:border-b *:border-gray-200 *:rounded-lg ">
				<div className="flex items-center justify-center col-span-3 "></div>
				<div className="flex items-center justify-center col-span-3 "></div>
			</div>
		</div>
	);
};

export default SignInWithFacebookOrGoogle;
