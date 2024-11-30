import "@/styles/LoadingFixed.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import App from "./App.tsx";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<App />
			<Toaster richColors position="top-right" duration={1500} />
		</AuthProvider>
	</QueryClientProvider>,
);
