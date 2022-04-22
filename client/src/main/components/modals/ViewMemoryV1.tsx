import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/allReducer";
import { IRecord } from "../../redux/actionSchemas/recordSchema";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { IUser } from "../../redux/actionSchemas/userSchema";
import { fetchComment, createComment, commentReset } from "../../redux/actions/commentAction";

import closeV1 from "../../assets/images/buttons/closeV1.png";
import arrowLeftV1 from "../../assets/images/icons/arrowLeftV1.png";
import arrowRightV1 from "../../assets/images/icons/arrowRightV1.png";

interface IProps {
	modalTigger: boolean;
	record: IRecord | undefined;
}

const ViewMemoryV1 = (props: IProps) => {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state.user);
	const commentState = useSelector((state: RootState) => state.comment);

	const [initialLaunch, setInitialLaunch] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [page, setPage] = useState(0);
	const [comment, setComment] = useState("");

	const [creatorState, setCreatorState] = useState<IUser>({
		_id: "",
		surname: "",
		given_name: "",
		user_profile: "",
		email: "",
		location: "",
		bio: "",
		birthday: "",
	});

	// toggle the visibility of modal and prevent the toggle in initial load
	useEffect(() => {
		if (initialLaunch) setInitialLaunch(false);
		else setShowModal(!showModal);

		// retrive the comment of the selected record
		if (props.record) {
			dispatch(fetchComment(props.record._id));

			// Get the creator details
			axios
				.get(`/api/userz/details/${props.record.creator}`)
				.then((res: any) => setCreatorState(res.data))
				.catch(err => console.log(err));
		}
	}, [props.modalTigger]);

	// Disable scroll when modal appear
	// useEffect(() => {
	// 	const body = document.querySelector("body");
	// 	if (body) {
	// 		if (showModal) body.style.overflow = "hidden";
	// 		else body.style.overflow = "auto";
	// 	}
	// }, [showModal]);

	const handleCloseBtn = () => {
		dispatch(commentReset());
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

	function handleHeightAdjustment() {
		if (document.getElementById("comment-input-height")) {
			let commentInput = document.getElementById("comment-input-height");
			let details = document.getElementById("details-container-height");
			if (commentInput && details) {
				commentInput.style.height = "6px"; // set the initial height
				commentInput.style.height = commentInput.scrollHeight + "px"; // add the scroll height

				// where scroll is not yet visible and the height is still adjusting, adjust the whitespace between input and view comment
				if (commentInput.scrollHeight <= 105) {
					details.style.height = "545px";
					// add for added white space from scroll height
					if (commentInput.scrollHeight === 105) details.style.height = `${details.clientHeight + 3}px`;
					details.style.height = `${details.clientHeight - commentInput.scrollHeight + 37}px`;
				}

				// visibility of scroll when reach 6th rows
				if (commentInput.scrollHeight > 110) commentInput.style.overflowY = "scroll";
				else commentInput.style.overflowY = "hidden";
			}
		}
	}

	const handleKeyPress = (e: any) => {
		if (e.key === "Enter") {
			setComment("");
			handleHeightAdjustment();

			if (props.record) dispatch(createComment(props.record._id, e.target.value));
			e.preventDefault();

			let element = document.getElementById("comment-input-height");
			let details = document.getElementById("details-container-height");
			if (element && details) {
				element.style.height = "37px";
				element.style.overflowY = "hidden";
				details.style.height = "545px";
			}
		}
	};

	const handleUserNavigate = (navigateUserID: string) => {
		// checks if the target user is the user itself && if the page is already at target profile page
		if (navigateUserID === userState._id && params.id) {
			dispatch(commentReset());
			navigate("/profile");
		} else if (navigateUserID !== userState._id && params.id !== navigateUserID) {
			dispatch(commentReset());
			navigate(`/profile/${navigateUserID}`);
		}
	};

	if (!showModal) return <React.Fragment></React.Fragment>;
	return (
		<div className="view-memory-modal-background">
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
								<img className="display-picture" src={creatorState.user_profile} alt="user profile" />
								<span className="cursor-point" onClick={() => handleUserNavigate(creatorState._id)}>
									<b>{`${creatorState.given_name} ${creatorState.surname}`}</b>
								</span>
							</div>

							<div className="no-select mini-menu-container">
								<div className="mini-menu-option-container">
									{props.record?.creator === userState._id ? (
										<span className="menu-item cursor-point" onClick={() => navigate(`/edit-memory/${props.record?._id}`)}>
											Edit Post
										</span>
									) : (
										<span className="menu-item cursor-point" onClick={() => console.log("Report")}>
											Report Post
										</span>
									)}
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
						<div>
							<div className="border"></div>

							{commentState.comments.map((comment, index) => (
								<div key={index} className="comment-view-container">
									<img src={comment.user_id.user_profile} alt="user profile" className="comment-view-user" />
									<div className="comment-view-name-msg">
										<p className="cursor-point" onClick={() => handleUserNavigate(comment.user_id._id)}>
											<b> {`${comment.user_id.given_name} ${comment.user_id.surname}`} </b>{" "}
										</p>
										<p>{comment.message}</p>
									</div>
								</div>
							))}
							<div className="comment-input-container">
								<img src={userState.user_profile} alt="user profile" className="comment-input-user" />
								<textarea
									name="comment"
									id="comment-input-height"
									className="comment-input-msg"
									placeholder="Write a comment..."
									rows={1}
									value={comment}
									onInput={handleHeightAdjustment}
									onChange={e => {
										setComment(e.target.value);
										handleHeightAdjustment();
									}}
									onKeyPress={handleKeyPress}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewMemoryV1;
