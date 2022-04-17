import React, { useState, useEffect } from "react";

import axios from "axios";
import { IRecordWithCreator } from "../../redux/actionSchemas/recordSchema";

import ViewMemoryV2 from "../modals/ViewMemoryV2";
import EmptyV1 from "../../assets/images/logo/emptyPhotoV1.png";

interface IProps {
	setSelectRecord: React.Dispatch<React.SetStateAction<IRecordWithCreator | undefined>>;
	selectRecord: IRecordWithCreator | undefined;
	setMemoryOfTheDay: () => void;
}

const DisplayAllMemoryV2 = (props: IProps) => {
	const [recordState, setRecordState] = useState<{ records: IRecordWithCreator[] }>({ records: [] });

	const [viewRecord, setViewRecord] = useState<IRecordWithCreator>();
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);
	const [filter, setFilter] = useState({
		title: "",
		description: "",
		tag: "",
		location: "",
		startDate: "",
		endDate: "",
	});

	useEffect(() => {
		retriveRecordByTitle();
	}, []);

	const retriveRecordByTitle = () => {
		axios
			.post(`/api/records/filter-multiple/`, filter)
			.then(res => setRecordState({ records: res.data }))
			.catch(err => console.log(err));
	};

	// fill the gap of 4 picture per column design to push the picture at the left side
	const emptyImages = () => {
		if (recordState.records?.length) {
			const columnCount = 5;
			const numberOfEmptySlots = columnCount - (recordState.records?.length % columnCount);
			const emptySlots = [];
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={EmptyV1} alt="record empty" key={index} className="all-memory-v2-display-container" />
			));
		}
	};

	const DisplayUserAllMemories = () => (
		<div className="all-memory-v2-center">
			<div className="all-memory-v2-container">
				{recordState.records?.map((record: IRecordWithCreator, index: number) => (
					<div key={index} className="checkbox-memory-container">
						<div
							className={` cursor-point checkbox-container ${props.selectRecord?._id === record._id ? "checkbox-active" : ""}`}
							onClick={() => (props.setSelectRecord ? props.setSelectRecord(record) : "")}
						></div>
						<img
							className="cursor-point all-memory-v2-display-container"
							src={record.images[0].link}
							alt="record image"
							onClick={() => selectMemory(record)}
						/>
					</div>
				))}
				{emptyImages()}
			</div>
		</div>
	);

	const selectMemory = (record: IRecordWithCreator) => {
		setTriggerViewMemory(!triggerViewMemory);
		setViewRecord(record);
	};

	return (
		<div className="all-memory-v2-parent">
			<ViewMemoryV2 modalTigger={triggerViewMemory} record={viewRecord} />
			<div className="search-submit-container">
				<div className="filter-field-container">
					<span className="filter-name">Title</span>
					<input
						className="search-input"
						placeholder="Title"
						type="text"
						name="title"
						id="title"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<div className="filter-field-container">
					<span className="filter-name">Description</span>
					<input
						className="search-input"
						placeholder="Description"
						type="text"
						name="description"
						id="description"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<div className="filter-field-container">
					<span className="filter-name">Hashtag</span>
					<input
						className="search-input"
						placeholder="Hashtag"
						type="text"
						name="tag"
						id="tag"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<div className="filter-field-container">
					<span className="filter-name">Location</span>
					<input
						className="search-input"
						placeholder="Location"
						type="text"
						name="location"
						id="location"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<div className="filter-field-container">
					<span className="filter-name">Start date</span>
					<input
						className="search-input"
						type="date"
						name="startDate"
						id="startDate"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<div className="filter-field-container">
					<span className="filter-name">End date</span>
					<input
						type="date"
						name="endDate"
						id="endDate"
						className="search-input"
						onChange={e => setFilter({ ...filter, [e.target.name]: e.target.value })}
					/>
				</div>

				<input
					type="button"
					value="Filter"
					onClick={() => {
						console.log(filter);
						axios
							.post(`/api/records/filter-multiple/`, filter)
							.then(res => {
								console.log(res.data);
								setRecordState({ records: res.data });
							})
							.catch(err => console.log(err));
					}}
					className="submit-btn"
				/>

				{/* <input type="button" value="Set" onClick={props.setMemoryOfTheDay} className="submit-btn" /> */}
			</div>
			<DisplayUserAllMemories />
		</div>
	);
};

export default DisplayAllMemoryV2;
