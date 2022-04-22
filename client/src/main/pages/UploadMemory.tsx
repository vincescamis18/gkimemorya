import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/allReducer";
import { createRecord } from "../redux/actions/recordAction";
import { INewRecordInput } from "../redux/actionSchemas/recordSchema";
import { useNavigate } from "react-router-dom";

import MutipleImageV2 from "../components/inputs/MultipleImageV2";
import LoadingScreeenV1 from "../components/loadingScreens/loadingScreeenV1";

import addMemoryV1 from "../assets/images/logo/addMemoryV1.png";
import memoryInformationV1 from "../assets/images/logo/memoryInformationV1.png";
import submitBtnV1 from "../assets/images/buttons/submitBtnV1.png";
import resetBtnV1 from "../assets/images/buttons/resetBtnV1.png";

const AddMemory: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state.user);
	const recordState = useSelector((state: RootState) => state.record);
	const [newRecord, setNewRecord] = useState<INewRecordInput>({
		images: null,
		title: "",
		date: "",
		owner: `${userState.given_name} ${userState.surname}`,
		description: "",
		tag: "",
		address: "",
		coordinate_x: 101,
		coordinate_y: 101,
		creator: userState._id,
	});
	const [isSubmited, setIsSubmited] = useState(false);

	useEffect(() => {
		// redirect to user page if the upload submission is successful
		if (isSubmited && !recordState.isLoading) navigate("/profile");
	}, [recordState]);

	useEffect(() => {
		// set creator id and intial owner field value
		if (!userState.isLoading && userState._id) {
			setNewRecord({ ...newRecord, creator: userState._id, owner: `${userState.given_name} ${userState.surname}` });
		}
	}, [userState]);

	const handleNewRecordInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
	};

	const resetRecordInput = () => {
		setNewRecord({
			images: null,
			title: "",
			date: "",
			owner: `${userState.given_name} ${userState.surname}`,
			description: "",
			tag: "",
			address: "",
			coordinate_x: 101,
			coordinate_y: 101,
			creator: userState._id,
		});
	};

	const handleClickSubmit = () => {
		if (
			newRecord.images &&
			newRecord.title &&
			newRecord.date &&
			newRecord.owner &&
			newRecord.description &&
			newRecord.tag &&
			newRecord.address &&
			newRecord.creator
		) {
			console.log("submit...", newRecord);
			setIsSubmited(true);
			dispatch(createRecord(newRecord));
		} else console.log("incomplete details", newRecord);
	};

	return (
		<div className="upload-memory">
			<LoadingScreeenV1 modalTigger={recordState.isLoading} />
			<div className="form-center">
				<div className="form-container">
					<img src={addMemoryV1} alt="Add Memory" className="title-padding" />

					<MutipleImageV2 setNewRecord={setNewRecord} newRecord={newRecord} />

					<img src={memoryInformationV1} alt="Memory Information" className="title-padding" />

					<div className="field-container">
						<p className="field-name">Title</p>
						<input
							type="text"
							name="title"
							placeholder="Title"
							className="normal-input-container"
							value={newRecord.title}
							onChange={handleNewRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Date</p>
						<input
							type="date"
							name="date"
							className="normal-input-container"
							value={newRecord.date}
							onChange={handleNewRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Owner</p>
						<input
							type="text"
							name="owner"
							placeholder="Owner"
							className="normal-input-container"
							value={newRecord.owner}
							onChange={handleNewRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Description</p>

						<textarea
							name="description"
							placeholder="Description"
							className="description-input-container"
							value={newRecord.description}
							onChange={handleNewRecordInputChange}
						></textarea>
					</div>

					<div className="field-container">
						<p className="field-name">Hashtag</p>
						<input
							type="text"
							name="tag"
							placeholder="Hashtag"
							className="normal-input-container"
							value={newRecord.tag}
							onChange={handleNewRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Location</p>
						<input
							type="text"
							name="address"
							placeholder="Location"
							className="normal-input-container"
							value={newRecord.address}
							onChange={handleNewRecordInputChange}
						/>
					</div>

					<div className="map-container"></div>

					<div className="policy-text">
						<p>
							I agree with the "Terms and Conditions" of the <b>Memorya Ph</b>
						</p>
					</div>

					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<img src={resetBtnV1} alt="reset" className="reset-btn" onClick={resetRecordInput} />
						<img src={submitBtnV1} alt="submit" className="submit-btn" onClick={handleClickSubmit} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddMemory;
