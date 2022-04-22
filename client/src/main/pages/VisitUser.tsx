import React, { useState, useEffect } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";
import { IUser } from "../redux/actionSchemas/userSchema";

import DisplayAllMemoryV1 from "../components/displayMemories/DisplayAllMemoryV1";

const VisitUser: React.FC = () => {
	const { id } = useParams();
	const [userState, setUserState] = useState<IUser>({
		_id: "",
		surname: "",
		given_name: "",
		user_profile: "",
		email: "",
		location: "",
		bio: "",
		birthday: "",
	});

	useEffect(() => {
		if (id) {
			// retrive selected user details
			axios
				.get(`/api/userz/details/${id}`)
				.then((res: any) => setUserState(res.data))
				.catch(err => console.log(err));
		}
	}, []);

	const getAge = () => {
		if (!userState.birthday) return "";

		const today = new Date();
		const birthDate = new Date(userState.birthday);

		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();

		// checks if their birthday is not passed
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

		return age;
	};

	if(!id) return <React.Fragment></React.Fragment>
	return (
		<React.Fragment>
			<div className="user-details-parent-container">
				<div className="user-details-top-container">
					<div className="user-details-top-left-container">
						<div></div>
						<div className="name-age-loc-container">
							<h4>regular contributor</h4>
							<h1>{`${userState.given_name} ${userState.surname}`}</h1>
							{userState.location ? <h4>{`${getAge()} | ${userState.location}`}</h4> : <React.Fragment></React.Fragment>}
						</div>
					</div>
					<img src={userState.user_profile} alt="user profile" className="img-container" />
				</div>
				<div className="user-details-btm-container">
					<div className="bio-parent-container">
						<div className="bio-output-container">
							<span>{userState.bio}</span>
						</div>
					</div>
				</div>
			</div>

			<DisplayAllMemoryV1 userId={id} />
		</React.Fragment>
	);
};

export default VisitUser;
