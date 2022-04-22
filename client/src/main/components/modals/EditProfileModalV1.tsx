import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/allReducer";
import { updateUser, updateUserWithoutProfilePicture } from "../../redux/actions/userAction";
import { INewUserInput } from "../../redux/actionSchemas/userSchema";

import LoadingScreeenV1 from "../loadingScreens/loadingScreeenV1";

import UploadImage from "../inputs/SingleImageV2";
import saveProfileV1 from "../../assets/images/buttons/saveProfileV1.png";
import editProfileV1 from "../../assets/images/logo/editProfileV1.png";
import closeV1 from "../../assets/images/buttons/closeV1.png";

interface IProps {
	modalTigger: boolean;
}

const EditProfile = (props: IProps) => {
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state.user);

	const [initialLaunch, setInitialLaunch] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isSubmited, setIsSubmited] = useState(false);

	const [updatedUser, setUpdatedUser] = useState<INewUserInput>({
		surname: "",
		given_name: "",
		user_profile: null,
		email: "",
		location: "",
		bio: "",
		birthday: "",
	});

	// toggle the visibility of modal and prevent the toggle in initial load
	useEffect(() => {
		if (initialLaunch) setInitialLaunch(false);
		else setShowModal(!showModal);
	}, [props.modalTigger]);

	// Prevent outer scroll to move if the modal is visible
	useEffect(() => {
		if (showModal) {
			const xValue = window.pageXOffset;
			const yValue = window.pageYOffset;
			window.onscroll = () => window.scrollTo(xValue, yValue);
		} else window.onscroll = () => window.scrollTo(window.pageXOffset, window.pageYOffset);
	}, [showModal]);

	useEffect(() => {
		// handle the submission of the form after clicking the btn and successful api call
		if (isSubmited && !userState.isLoading) setShowModal(!showModal);

		// set the initial value of input based on availability
		if (userState.email)
			setUpdatedUser({
				...updatedUser,
				surname: userState.surname,
				given_name: userState.given_name,
				location: userState.location,
				bio: userState.bio,
				birthday: userState.birthday ? new Date(userState.birthday).toISOString().split("T")[0] : "",
			});
	}, [userState]);

	const handleUpdateRecordInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUpdatedUser({
			...updatedUser,
			[e.target.name]: e.target.value,
		});
	};

	const handleSaveBtn = () => {
		// console.log(updatedUser); // Debug
		// Prevent user from submiting incomplete details
		if (updatedUser.surname && updatedUser.given_name && updatedUser.location && updatedUser.bio && updatedUser.birthday) {
			setIsSubmited(true);
			if (updatedUser.user_profile) dispatch(updateUser(updatedUser));
			else dispatch(updateUserWithoutProfilePicture(updatedUser));
		}
	};

	const handleCloseBtn = () => {
		setShowModal(false);
		setUpdatedUser({
			surname: userState.surname,
			given_name: userState.given_name,
			user_profile: null,
			email: userState.email,
			location: userState.location,
			bio: userState.bio,
			birthday: userState.birthday ? new Date(userState.birthday).toISOString().split("T")[0] : "",
		});
	};

	if (!userState.email) return <React.Fragment></React.Fragment>;
	if (!showModal) return <React.Fragment></React.Fragment>;
	return (
		<div className="editProfileModal-background">
			<LoadingScreeenV1 modalTigger={userState.isLoading} />
			<div className="editProfileModal-container">
				<img src={closeV1} alt="close button" className="close-btn" onClick={handleCloseBtn} />
				<div className="top-section-container">
					<div className="top-section-block-01-container">
						<div className="image-input-seperator">
							<div className="block-edit-save-container">
								<img src={editProfileV1} alt="edit profile" className="edit-margin" />
								<img src={saveProfileV1} alt="save button" className="save-btn" onClick={handleSaveBtn} />
							</div>
							<div>
								<input
									type="text"
									name="given_name"
									placeholder="Given Name"
									className="name-input"
									value={updatedUser.given_name}
									onChange={handleUpdateRecordInputChange}
								/>
								<input
									type="text"
									name="surname"
									placeholder="Last Name"
									className="name-input"
									value={updatedUser.surname}
									onChange={handleUpdateRecordInputChange}
								/>
							</div>
						</div>
						<UploadImage updatedUser={updatedUser} setUpdatedUser={setUpdatedUser} />
					</div>

					<div className="top-section-block-02-container">
						<input
							type="date"
							name="birthday"
							value={updatedUser.birthday}
							className="birthday-input"
							onChange={handleUpdateRecordInputChange}
						/>
						<input
							type="text"
							className="location-input"
							name="location"
							placeholder="Location"
							value={updatedUser.location}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>
				</div>

				<div className="btm-section-container">
					<textarea
						name="bio"
						placeholder="Bio"
						value={updatedUser.bio}
						className="bio-input"
						onChange={handleUpdateRecordInputChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
