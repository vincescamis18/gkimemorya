import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/allReducer";
import { IRecordWithCreator } from "../../redux/actionSchemas/recordSchema";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import closeV1 from "../../assets/images/buttons/closeV1.png";
import arrowLeftV1 from "../../assets/images/icons/arrowLeftV1.png";
import arrowRightV1 from "../../assets/images/icons/arrowRightV1.png";

interface IProps {
	modalTigger: boolean;
	isLoading: boolean;
	record: IRecordWithCreator | undefined;
	deleteMemoryOfTheDay: () => void;
}

const ViewMemoryV3 = (props: IProps) => {
	const navigate = useNavigate();
	const params = useParams();
	const locationURL = useLocation();
	const userState = useSelector((state: RootState) => state.user);

	const [initialLaunch, setInitialLaunch] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [page, setPage] = useState(0);
	const [isRemoveClicked, setIsRemoveClicked] = useState(true);

	// toggle the visibility of modal and prevent the toggle in initial load
	useEffect(() => {
		if (initialLaunch) setInitialLaunch(false);
		else setShowModal(!showModal);
	}, [props.modalTigger]);

	// close modal after successful deletion
	useEffect(() => {
		if (!props.isLoading && isRemoveClicked) {
			setIsRemoveClicked(false);
			setShowModal(false);
		}
	}, [props.isLoading]);

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
		setShowEdit(false);
		setPage(0);
	};

	const getFormatedDate = () => {
		if (props.record) {
			const date = new Date(props.record?.date);
			const month = date.getMonth() + 1;
			const day = date.getDate();

			// add 0 in front if the number is single
			return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}/${date.getFullYear()}`;
		}
	};

	const changePage = (move: string) => {
		// prevent the change page if it reaches the last/end page
		if (props.record) {
			if (move === "next" && props.record?.images.length > page + 1) setPage(page + 1);
			if (move === "back" && page > 0) setPage(page - 1);
		}
	};

	const MultipleImageView = () => (
		<div className="multi-image-container">
			<img src={props.record?.images[page].link} alt="record image" className="image-record" />
			<img className="back-arrow" src={arrowLeftV1} alt="arrow left" onClick={() => changePage("back")} />
			<img className="next-arrow" src={arrowRightV1} alt="arrow right" onClick={() => changePage("next")} />
			<div className="dot-container-middle">
				<div className="dot-container-bottom">
					<div className="dot-container-column">
						{props.record?.images.map((item, index) => (
							<div key={index} className={index === page ? "active-dot" : "inactive-dot"}></div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	const handleUserNavigate = (navigateUserID: string | undefined) => {
		// Checks if the target page is not the current page
		if (
			!(locationURL.pathname === "/profile" && !params.id && navigateUserID === userState._id) &&
			!(locationURL.pathname !== "/profile" && params.id && navigateUserID === params.id)
		) {
			// checks if target page is other user or user itself
			if (navigateUserID !== userState._id) navigate(`/profile/${navigateUserID}`);
			else navigate("/profile");
		}
	};

	const handleRemoveMemory = () => {
		props.deleteMemoryOfTheDay();
		setIsRemoveClicked(true);
	};

	if (!showModal) return <React.Fragment></React.Fragment>;
	return (
		<div className="view-memory-modal-v3-background">
			<div className="view-memory-modal-container">
				<img src={closeV1} alt="close button" className="close-btn" onClick={handleCloseBtn} />
				<div className="image-details-container">
					<div className="image-container">
						{props.record?.images.length === 1 ? (
							<img src={props.record?.images[0].link} alt="record image" className="image-record" />
						) : (
							<MultipleImageView />
						)}
					</div>

					<div className="details-container" id="details-container-height">
						<div className="picture-name-menu-container">
							<div className="picture-name-container">
								<img className="display-picture" src={props.record?.creator.user_profile} alt="" />
								<p className="cursor-point" onClick={() => handleUserNavigate(props.record?.creator._id)}>
									<b>{`${props.record?.creator.given_name} ${props.record?.creator.surname}`}</b>
								</p>
							</div>

							<div className="no-select mini-menu-container">
								<div className="mini-menu-option-container">
									<span className="menu-item cursor-point" onClick={handleRemoveMemory}>
										Remove Memory
									</span>
								</div>
								<div className="mini-menu-icon" onClick={() => setShowEdit(!showEdit)}>
									•••
								</div>
							</div>
						</div>

						<p className="title">{props.record?.title}</p>
						<div className="border"></div>
						<div className="owner-date-container">
							<p className="light-text">{props.record?.owner}</p>
							<p className="light-text">{getFormatedDate()}</p>
						</div>
						<span className="light-text">{props.record?.address}</span>
						<p className="description-text">{props.record?.description}</p>
						<p className="description-text" style={{ color: "blue" }}>
							{props.record?.tag}
						</p>

						<div className="border"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewMemoryV3;
