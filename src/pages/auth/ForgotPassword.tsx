import { useState } from "react";
import FindEmail from "./FindEmail";
import ResetPassword from "./ResetPassword";
import VerifyOtp from "./VerifyOtp";

const ForgotPassword = () => {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	return (
		<>
			{step == 1 && <FindEmail setStep={setStep} setEmail={setEmail} />}
			{step == 2 && <VerifyOtp setStep={setStep} email={email} />}
			{step == 3 && <ResetPassword setStep={setStep} email={email as string} />}
		</>
	);
};

export default ForgotPassword;
