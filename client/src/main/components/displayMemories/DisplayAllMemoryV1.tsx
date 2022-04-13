import React, { useState, useEffect } from "react";

import axios from "axios";
import { IRecordWithCreator } from "../../redux/actionSchemas/recordSchema";

import ViewMemoryV2 from "../modals/ViewMemoryV2";

import EmptyV1 from "../../assets/images/icons/emptyV3.png";

interface IProps {
	userId: string | undefined;
}

const DisplayAllMemoryV1 = (props: IProps) => {
	const [recordState, setRecordState] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [selectRecord, setSelectRecord] = useState<IRecordWithCreator>();
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	useEffect(() => {
		// if there is userId retrive the memory of user otherwise retrive all memory
		if (props.userId) {
			axios
				.get(`/api/records/record-creator/user/${props.userId}`)
				.then((res: any) => setRecordState({ records: res.data }))
				.catch(err => console.log("err", err));
		} else {
			axios
				.get(`/api/records/record-creator`)
				.then(res => {
					console.log("Record-creator", res.data);
					setRecordState({ records: res.data });
				})
				.catch(err => console.log("err", err));
		}
	}, []);

	// fill the gap of 4 picture per column design to push the picture at the left side
	const emptyImages = () => {
		if (recordState.records?.length) {
			const numberOfEmptySlots = recordState.records?.length % 4;
			const emptySlots = [];
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={EmptyV1} alt="record empty" key={index} className="all-memory-display-container" />
			));
		} else return <img src={EmptyV1} alt="record empty" className="all-memory-display-container" />;
	};

	const DisplayUserAllMemories = () => (
		<div className="all-memory-parent">
			<div className="all-memory-container">
				{recordState.records?.map((record: IRecordWithCreator, index: number) => (
					<React.Fragment>
						<div className="memory-containner cursor-point no-select" onClick={() => selectMemory(record)}>
							<div className="memory-details">
								<h4>{record.title}</h4>
								<p className="description">{record.description}</p>
							</div>

							<img className=" all-memory-display-container" src={record.images[0].link} key={index} alt="record image" />
						</div>
					</React.Fragment>
				))}
				{emptyImages()}
			</div>
		</div>
	);

	const selectMemory = (record: IRecordWithCreator) => {
		setTriggerViewMemory(!triggerViewMemory);
		setSelectRecord(record);
	};

	return (
		<div>
			<ViewMemoryV2 modalTigger={triggerViewMemory} record={selectRecord} />
			<DisplayUserAllMemories />
		</div>
	);
};

export default DisplayAllMemoryV1;
