import React, { useState, useEffect } from "react";

import axios from "axios";
import { IRecordWithCreator } from "../redux/actionSchemas/recordSchema";
import { useParams } from "react-router-dom";

import NavbarV1 from "../components/headers/NavbarV1";
import ViewMemoryV2 from "../components/modal/ViewMemoryV2";

import EmptyV1 from "../assets/images/icons/emptyV1.png";

const CurratedCollection = () => {
	const params = useParams();

	const [recordState, setRecordState] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	// const [viewRecord, setViewRecord] = useState<any>([]);
	const [selectRecord, setSelectRecord] = useState<any>([]);
	const [curationInformation, setCurationInformation] = useState<any>({ title: "", description: "", images: null, _id: "" });
	const [viewRecord, setViewRecord] = useState<IRecordWithCreator>();
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	useEffect(() => {
		console.log("Hello there");
		axios
			.get(`/api/compiled-memory/details-record/${params.id}`)
			.then(res => {
				if (res.data) {
					const { description, images, title, records } = res.data[0];
					setCurationInformation({ description, images, title });
					setSelectRecord(records);
				}
				console.log("res.data", res.data);
			})
			.catch(err => console.log("err", err));
		axios
			.get(`/api/records/record-creator`)
			.then(res => setRecordState({ records: res.data }))
			.catch(err => console.log("err", err));
	}, []);

	// fill the gap of 4 picture per column design to push the picture at the left side
	const emptyImages = () => {
		if (selectRecord?.length) {
			const numberOfEmptySlots = selectRecord?.length % 4;
			const emptySlots = [];
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={EmptyV1} alt="record empty" key={index} className="all-memory-display-container" />
			));
		}
	};

	const DisplayUserAllMemories = () => (
		<div className="all-memory-parent">
			<div className="all-memory-container">
				{recordState.records?.map((record: any, index: number) => {
					if (selectRecord.find((item: any) => item.record._id == record._id))
						return (
							<img
								className="cursor-point all-memory-display-container"
								src={record.images[0].link}
								key={index}
								alt="record image"
								onClick={() => {
									setViewRecord(record);
									setTriggerViewMemory(!triggerViewMemory);
								}}
							/>
						);
				})}
				{emptyImages()}
			</div>
		</div>
	);

	if (!curationInformation.title)
		return (
			<React.Fragment>
				<h1>loading</h1>
			</React.Fragment>
		);

	return (
		<React.Fragment>
			<NavbarV1 />
			<div className="curated-collection-page-parent">
				<div className="header-container">
					<img className="img-collection-container" src={curationInformation.images[0].link} alt="curation" />
					<div className="info-collection-container">
						<h1>{curationInformation.title}</h1>
						<p>{curationInformation.description}</p>
					</div>
				</div>
			</div>

			<div style={{ backgroundColor: "FFFFFF", paddingBottom: "500px" }}>
				<ViewMemoryV2 modalTigger={triggerViewMemory} record={viewRecord} />
				<DisplayUserAllMemories />
			</div>
		</React.Fragment>
	);
};

export default CurratedCollection;
