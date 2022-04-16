import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const DisplayAllMemoryUsersV1 = () => {
	const navigate = useNavigate();
	const [allUsers, setallUsers] = useState([]);

	useEffect(() => {
		axios
			.get(`/api/userz/rank/`)
			.then(res => setallUsers(res.data.users))
			.catch(err => console.log("err", err));
	}, []);

	return (
		<div className="center-all-users-parent">
			{allUsers?.map((user: any) => (
				<div className="user-item no-select" key={user._id} onClick={() => navigate(`/profile/${user._id}`)}>
					<div className="user-details-container ">
						<img src={user.user_profile} alt="profile" className="user-image-container" />
						<h1>{user.given_name + " " + user.surname}</h1>
					</div>
					<h1>{user.post}</h1>
				</div>
			))}
		</div>
	);
};

export default DisplayAllMemoryUsersV1;
