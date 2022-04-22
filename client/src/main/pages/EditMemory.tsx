import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/allReducer";
import { updateRecord, fetchRecord } from "../redux/actions/recordAction";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import LoadingScreeenV1 from "../components/loadingScreens/loadingScreeenV1";

import addMemoryV1 from "../assets/images/logo/editMemoryV1.png";
import memoryInformationV1 from "../assets/images/logo/memoryInformationV1.png";
import submitBtnV1 from "../assets/images/buttons/submitBtnV1.png";
import emptyPhotoV1 from "../assets/images/logo/emptyPhotoV1.png";

const EditMemory: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state.user);
	const recordState = useSelector((state: RootState) => state.record);
	const [updatedRecord, setUpdatedRecord] = useState({
		_id: "",
		updItem: {
			title: "",
			date: "",
			owner: "",
			description: "",
			tag: "",
			address: "",
			coordinate_x: 0,
			coordinate_y: 0,
			creator: "",
		},
	});
	const [images, setImages] = useState<{ link: string; _id: string }[]>([]);
	const [isSubmited, setIsSubmited] = useState(false);

	useEffect(() => {
		if (userState._id) dispatch(fetchRecord(userState._id));
	}, [userState]);

	useEffect(() => {
		// console.log(recordState); // Debug
		// check if the get recordState has been fetch
		if (recordState.records.length > 0) {
			// get record using the the id parameter
			const editRecord = recordState.records.filter(record => record._id === id);

			// console.log(editRecord); // Debug
			// checks if the record exists before assigning initial field values
			if (editRecord[0]) {
				let { _id, title, date, owner, description, tag, address, coordinate_x, coordinate_y, creator, images } = editRecord[0];
				setImages(images);
				date = new Date(date).toISOString().split("T")[0];
				setUpdatedRecord({
					_id,
					updItem: { title, date, owner, description, tag, address, coordinate_x, coordinate_y, creator },
				});
			}
		}

		// redirect to user page if the edit submission is successful
		if (isSubmited && !recordState.isLoading) navigate("/profile");
	}, [recordState]);

	const handleUpdateRecordInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUpdatedRecord({
			...updatedRecord,
			updItem: {
				...updatedRecord.updItem,
				[e.target.name]: e.target.value,
			},
		});
	};

	const handleClickSubmit = () => {
		// Checks if there are missing data before dispatching
		if (
			updatedRecord.updItem.title &&
			updatedRecord.updItem.date &&
			updatedRecord.updItem.owner &&
			updatedRecord.updItem.description &&
			updatedRecord.updItem.tag &&
			updatedRecord.updItem.address &&
			updatedRecord.updItem.creator
		) {
			console.log("submit...", updatedRecord);
			setIsSubmited(true);
			dispatch(updateRecord(updatedRecord));
		} else console.log("incomplete details", updatedRecord);
	};

	const renderEmptyImage = () => {
		// render an empty image to each missing photo in the row
		let render = [];
		for (let a = 0; a < 4 - images.length; a++) render.push(a);
		return render.map((item, index) => <img src={emptyPhotoV1} key={index} alt="upload button" />);
	};

	return (
		<div className="upload-memory">
			<LoadingScreeenV1 modalTigger={recordState.isLoading} />
			<div className="form-center">
				<div className="form-container">
					<img src={addMemoryV1} alt="Add Memory" className="title-padding" />

					<div className="image-layout-container">
						{images.map((image, index: number) => (
							<img src={image.link} key={index} alt="record" className="image-container" />
						))}
						{renderEmptyImage()}
					</div>

					<img src={memoryInformationV1} alt="Memory Information" className="title-padding" />

					<div className="field-container">
						<p className="field-name">Title</p>
						<input
							type="text"
							name="title"
							placeholder="Title"
							className="normal-input-container"
							value={updatedRecord.updItem.title}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Date</p>
						<input
							type="date"
							name="date"
							className="normal-input-container"
							value={updatedRecord.updItem.date}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Owner</p>
						<input
							type="text"
							name="owner"
							placeholder="Owner"
							className="normal-input-container"
							value={updatedRecord.updItem.owner}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Description</p>

						<textarea
							name="description"
							placeholder="Description"
							className="description-input-container"
							value={updatedRecord.updItem.description}
							onChange={handleUpdateRecordInputChange}
						></textarea>
					</div>

					<div className="field-container">
						<p className="field-name">Hashtag</p>
						<input
							type="text"
							name="tag"
							placeholder="Hashtag"
							className="normal-input-container"
							value={updatedRecord.updItem.tag}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>

					<div className="field-container">
						<p className="field-name">Location</p>
						<input
							type="text"
							name="address"
							placeholder="Location"
							className="normal-input-container"
							value={updatedRecord.updItem.address}
							onChange={handleUpdateRecordInputChange}
						/>
					</div>

					<div className="map-container"></div>

					<div className="policy-text">
						<p>
							I agree with the "Terms and Conditions" of the <b>Memorya Ph</b>
						</p>
					</div>

					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<img src={submitBtnV1} alt="submit" className="submit-btn" onClick={handleClickSubmit} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditMemory;
