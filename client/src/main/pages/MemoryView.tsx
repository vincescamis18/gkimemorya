import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/allReducer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton } from "react-share";

import { fetchComment, createComment, commentReset } from "../redux/actions/commentAction";

import ReportCotent from "../components/modals/ReportContent";
import NavbarV1 from "../components/headers/NavbarV1";

import arrowLeftV1 from "../assets/images/icons/arrowLeftV1.png";
import arrowRightV1 from "../assets/images/icons/arrowRightV1.png";
import emptyV2 from "../assets/images/icons/emptyV2.png";
import axios from "axios";

const MemoryView = () => {
	const navigate = useNavigate();
	const params = useParams();
	const locationURL = useLocation();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const commentState = useSelector((state: RootState) => state.comment);

	const [triggerReportContent, setTriggerReportContent] = useState(false);
	const [recordState, setRecordState] = useState<any>(null);

	const [initialLaunch, setInitialLaunch] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [page, setPage] = useState(0);
	const [comment, setComment] = useState("");

	// toggle the visibility of modal and prevent the toggle in initial load
	useEffect(() => {
		if (initialLaunch) setInitialLaunch(false);
		else setShowModal(!showModal);

		axios
			.get(`api/records/record-creator/${params.id}`)
			.then(res => {
				setRecordState(res.data);
				dispatch(fetchComment(res.data._id));
			})
			.catch(err => console.log(err));
	}, []);

	// Prevent outer scroll to move if the modal is visible
	useEffect(() => {
		if (showModal) {
			const xValue = window.pageXOffset;
			const yValue = window.pageYOffset;
			window.onscroll = () => window.scrollTo(xValue, yValue);
		} else window.onscroll = () => window.scrollTo(window.pageXOffset, window.pageYOffset);
	}, [showModal]);

	const handleCloseBtn = () => {
		dispatch(commentReset());
		setComment("");
		setShowModal(false);
		setShowEdit(false);
		setPage(0);
	};

	const getFormatedDate = () => {
		if (recordState) {
			const date = new Date(recordState?.date);
			const month = date.getMonth() + 1;
			const day = date.getDate();

			// add 0 in front if the number is single
			return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}/${date.getFullYear()}`;
		}
	};

	const changePage = (move: string) => {
		// prevent the change page if it reaches the last/end page
		if (recordState) {
			if (move === "next" && recordState?.images.length > page + 1) setPage(page + 1);
			if (move === "back" && page > 0) setPage(page - 1);
		}
	};

	const MultipleImageView = () => (
		<div className="multi-image-container">
			<img src={recordState?.images[page].link} alt="record image" className="image-record" />
			<img className="back-arrow" src={arrowLeftV1} alt="arrow left" onClick={() => changePage("back")} />
			<img className="next-arrow" src={arrowRightV1} alt="arrow right" onClick={() => changePage("next")} />
			<div className="dot-container-middle">
				<div className="dot-container-bottom">
					<div className="dot-container-column">
						{recordState?.images.map((item: any, index: number) => (
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
			//redirect unregistered user to registration
			if (!userState._id) navigate("/register");
			else {
				setComment("");
				handleHeightAdjustment();

				if (recordState) dispatch(createComment(recordState._id, e.target.value));
				e.preventDefault();

				let element = document.getElementById("comment-input-height");
				let details = document.getElementById("details-container-height");
				if (element && details) {
					element.style.height = "37px";
					element.style.overflowY = "hidden";
					details.style.height = "545px";
				}
			}
		}
	};

	const CommentSection = () => {
		return commentState.comments.map((comment, index) => (
			<div key={index} className="comment-view-container">
				<img src={comment.user_id.user_profile} alt="user profile" className="comment-view-user" />
				<div className="comment-view-name-msg">
					<p className="cursor-point" onClick={() => handleUserNavigate(comment.user_id._id)}>
						<b> {`${comment.user_id.given_name} ${comment.user_id.surname}`} </b>{" "}
					</p>
					<p>{comment.message}</p>
				</div>
			</div>
		));
	};

	const handleUserNavigate = (navigateUserID: string | undefined) => {
		// Checks if the target page is not the current page
		if (
			!(locationURL.pathname === "/profile" && !params.id && navigateUserID === userState._id) &&
			!(locationURL.pathname !== "/profile" && params.id && navigateUserID === params.id)
		) {
			dispatch(commentReset());
			// checks if target page is other user or user itself
			if (navigateUserID !== userState._id) navigate(`/profile/${navigateUserID}`);
			else navigate("/profile");
		}
	};

	const handleEditMemory = () => {
		window.onscroll = () => window.scrollTo(window.pageXOffset, window.pageYOffset);
		navigate(`/edit-memory/${recordState?._id}`);
	};

	const handleReportMemory = () => {
		if (!userState._id) navigate("/register");
		else setTriggerReportContent(!triggerReportContent);
	};

	if (recordState === null) return <React.Fragment></React.Fragment>;
	return (
		<React.Fragment>
			<NavbarV1 />
			<div className="view-memory-page-modal-background">
				<div className="view-memory-modal-container">
					<ReportCotent modalTigger={triggerReportContent} recordId={recordState?._id} />

					{/* <img src={closeV1} alt="close button" className="close-btn" onClick={handleCloseBtn} /> */}
					<div className="image-details-container">
						<div className="image-container">
							{recordState?.images.length === 1 ? (
								<img src={recordState?.images[0].link} alt="record image" className="image-record" />
							) : (
								<MultipleImageView />
							)}
						</div>

						<div className="details-container" id="details-container-height">
							<div className="picture-name-menu-container">
								<div className="picture-name-container">
									<img className="display-picture" src={recordState?.creator.user_profile} alt="" />
									<p className="cursor-point" onClick={() => handleUserNavigate(recordState?.creator._id)}>
										<b>{`${recordState?.creator.given_name} ${recordState?.creator.surname}`}</b>
									</p>
								</div>

								<div className="no-select mini-menu-container">
									<div className="mini-menu-option-container">
										{recordState?.creator._id === userState._id ? (
											<span className="menu-item cursor-point" onClick={handleEditMemory}>
												Edit Post
											</span>
										) : (
											<span className="menu-item cursor-point" onClick={handleReportMemory}>
												Report Post
											</span>
										)}
										<span className="menu-item cursor-point">
											<FacebookShareButton
												url={`https://memorya.herokuapp.com/#/memory/${params.id}`}
												title="Checkout this memory"
											>
												Share to FB
											</FacebookShareButton>
										</span>

										<span className="menu-item cursor-point">
											<TwitterShareButton
												url={`https://memorya.herokuapp.com/#/memory/${params.id}`}
												title="Checkout this memory"
											>
												Share to Twitter
											</TwitterShareButton>
										</span>
									</div>
									<div className="mini-menu-icon" onClick={() => setShowEdit(!showEdit)}>
										•••
									</div>
								</div>
							</div>

							<p className="title">{recordState?.title}</p>
							<div className="border"></div>
							<div className="owner-date-container">
								<p className="light-text">{recordState?.owner}</p>
								<p className="light-text">{getFormatedDate()}</p>
							</div>
							<span className="light-text">{recordState?.address}</span>
							<p className="description-text">{recordState?.description}</p>
							<p className="description-text" style={{ color: "blue" }}>
								{recordState?.tag}
							</p>

							<div className="border"></div>

							{CommentSection()}

							<div className="comment-input-container">
								<img src={userState._id ? userState.user_profile : emptyV2} alt="user profile" className="comment-input-user" />
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
		</React.Fragment>
	);
};

export default MemoryView;
