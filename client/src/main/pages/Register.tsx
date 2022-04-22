import React, { useRef } from "react";

import facebookBtn from "../assets/images/buttons/facebookV1.png";
import googleBtn from "../assets/images/buttons/googleV1.png";

const Register: React.FC = () => {
	// set the origin on both development and production
	const origin = useRef(window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin);

	const googleAuth = () => window.open(`${origin.current}/auth/google`, "_self");
	// const facebookAuth = () => window.open(`${origin.current}/auth/facebook`, "_self");
	// const githubAuth = () => window.open(`${origin.current}/auth/github`, "_self");

	return (
		<div className="register">
			<div className="right-container">
				<div className="input-container">
					<img src={facebookBtn} alt="FB auth" className="facebookBtn" onClick={() => console.log("FB")} />
					<img src={googleBtn} alt="google auth" className="googleBtn" onClick={googleAuth} />
					<span className="policy-text">
						By contuing, you agree to Memorya Ph’s{" "}
						<b className="policy" onClick={() => console.log("Terms and Conditions")}>
							Terms and Conditions
						</b>
					</span>
				</div>
			</div>
		</div>
	);
};

export default Register;
