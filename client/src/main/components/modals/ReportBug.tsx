import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/allReducer";

import axios from "axios";
import LoadingScreenV1 from "../loadingScreens/loadingScreeenV1";

import closeV1 from "../../assets/images/buttons/closeV2.png";
import submitBtnV2 from "../../assets/images/buttons/submitBtnV2.png";

interface IProps {
	modalTigger: boolean;
}

const ReportBug = (props: IProps) => {
	const userState = useSelector((state: RootState) => state.user);
	const [initialLaunch, setInitialLaunch] = useState(true);
	const [showModal, setShowModal] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [description, setDescription] = useState<string>("");
	const [title, setTitle] = useState<string>("");

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

	const handleCloseBtn = () => {
		setShowModal(false);
		setDescription("");
		setTitle("");
	};

	const handleSubmit = () => {
		if (title) {
			if (description) {
				setIsSubmitting(true);

				const body = { title, description, reporter: userState._id };
				axios
					.post("/api/bug", body)
					.then(() => {
						setIsSubmitting(false);
						handleCloseBtn();
						console.log("Success");
					})
					.catch(err => console.log(err));
			} else console.log("Please enter a description first");
		} else {
			console.log("Please enter a title first");
		}
	};

	if (!showModal) return <React.Fragment></React.Fragment>;
	return (
		<React.Fragment>
			<div className="bug-parent">
				<LoadingScreenV1 modalTigger={isSubmitting} />
				<div className="bug-center">
					<div className="bug-container">
						<div className="title-exist">
							<h1>Report Bug</h1>
							<img src={closeV1} alt="close button" className="cursor-point exit" onClick={handleCloseBtn} />
						</div>

						<input
							type="text"
							name="title"
							id="title"
							className="bug-title"
							placeholder="Title"
							onChange={e => setTitle(e.target.value)}
						/>

						<textarea
							name="description"
							id="description"
							placeholder="Description"
							className="description"
							onChange={e => setDescription(e.target.value)}
						/>

						<div className="submit-btn-center">
							<img src={submitBtnV2} alt="submit Button" className="cursor-point" onClick={handleSubmit} />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ReportBug;
