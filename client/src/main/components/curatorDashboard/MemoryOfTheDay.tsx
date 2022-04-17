import React, { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // for selectable

import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/allReducer";
import { IRecordWithCreator } from "../../redux/actionSchemas/recordSchema";

import ViewMemoryV3 from "../modals/ViewMemoryV3";
import DisplayAllMemoryV2 from "../../components/displayMemories/DisplayAllMemoryV2";

interface ICalendar {
	id: string;
	title: string;
	start: string;
	end: string;
	record: string | undefined;
}

const MemoryOfTheDay = () => {
	const userState = useSelector((state: RootState) => state.user);
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	const [selectRecord, setSelectRecord] = useState<IRecordWithCreator>();
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);

	const [allFeaturedMemories, setAllFeaturedMemories] = useState<ICalendar[]>([]);
	const [viewFeaturedMemory, setViewFeaturedMemoy] = useState<IRecordWithCreator>();
	const [selectedFeaturedMemoryId, setSelectedFeaturedMemoryId] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		retriveMemoryOfTheDay();
	}, []);

	const retriveMemoryOfTheDay = () => {
		setIsLoading(true);
		axios
			.get("/api/featured-memory/details-record-user/")
			.then(res => {
				let retrivedFeaturedMemory: ICalendar[] = [];

				if (res.data.length > 0) {
					res.data.forEach((featuredMemory: any) => {
						retrivedFeaturedMemory.push({
							id: featuredMemory._id,
							title: featuredMemory.record_id.title,
							start: featuredMemory.date_start.split("T")[0],
							end: featuredMemory.date_end.split("T")[0],
							record: featuredMemory.record_id,
						});
					});

					setAllFeaturedMemories(retrivedFeaturedMemory);
					setIsLoading(false);
				}
			})
			.catch(err => console.log(err));
	};

	const setMemoryOfTheDay = () => {
		if (selectRecord?.title && selectRecord?._id && startDate && endDate) {
			const daysDifference = moment(endDate).diff(moment(startDate), "days");
			let validSelectedRangeDate = true;

			// loop all the existing date range
			for (let a = 0; a < allFeaturedMemories.length; a++) {
				// loop all the selected date in range
				for (let b = 0; b < daysDifference; b++) {
					const testDate = moment(startDate).add(b, "days");
					const endDateDifferece = testDate.diff(moment(allFeaturedMemories[a].end), "days");
					const startDateDifferece = testDate.diff(moment(allFeaturedMemories[a].start), "days");

					// checks if the testDate is between the existing date range
					if (startDateDifferece >= 0 && endDateDifferece <= -1) {
						validSelectedRangeDate = false;
						break;
					}
				}
				if (!validSelectedRangeDate) break;
			}

			if (validSelectedRangeDate && !isLoading) {
				setIsLoading(true);
				// create featured memory instance and retrive the latest
				const body = { date_start: startDate, date_end: endDate, record_id: selectRecord?._id, creator: userState._id };
				axios
					.post("/api/featured-memory/", body)
					.then(() => retriveMemoryOfTheDay())
					.catch(err => console.log(err));
			}
		}
	};

	const deleteMemoryOfTheDay = () => {
		console.log(allFeaturedMemories);

		// console.log(check);
		setIsLoading(true);
		axios
			.delete(`api/featured-memory/${selectedFeaturedMemoryId}`)
			.then(() => {
				const updatedAllFeaturedMemory = allFeaturedMemories.filter(item => item.id !== selectedFeaturedMemoryId);
				setAllFeaturedMemories(updatedAllFeaturedMemory);
				setIsLoading(false);
			})
			.catch(err => console.log("err", err));
	};

	const handleViewFeaturedMemory = (target: any) => {
		if (target.event.id) {
			// get the record details of selected featuredmemory from allFeaturedMemories
			let selectedMemory: any = allFeaturedMemories.filter(item => item.id === target.event.id);
			if (selectedMemory.length > 0) {
				setSelectedFeaturedMemoryId(target.event.id);
				setViewFeaturedMemoy(selectedMemory[0].record);
				setTriggerViewMemory(!triggerViewMemory);
			}
		}
	};

	const handleChangeDateRange = (select: any) => {
		if (select) {
			setStartDate(select.startStr);
			setEndDate(select.endStr);
		}
	};

	return (
		<React.Fragment>
			<div className="dashboard-memory-of-the-day">
				<div className="calendar-form-container">
					<div className="calendar-container">
						<FullCalendar
							initialView="dayGridMonth"
							plugins={[interactionPlugin, dayGridPlugin]}
							unselectAuto={false}
							selectable={true}
							events={allFeaturedMemories}
							select={handleChangeDateRange}
							eventClick={handleViewFeaturedMemory}
						/>
					</div>
					<div className="form-container">
						<input type="button" value="Submit" className="set-btn" onClick={setMemoryOfTheDay} />
						<img
							className="image-container"
							src={selectRecord ? selectRecord.images[0].link : "https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png"}
						/>
						<p className="title-container">{selectRecord ? selectRecord.title : "Memory of the day"}</p>
						<p className="description-container">
							{selectRecord ? selectRecord.description : "Highlight the desired date > Select a memory > Review and click submit"}
						</p>
					</div>
				</div>
				<DisplayAllMemoryV2 selectRecord={selectRecord} setSelectRecord={setSelectRecord} setMemoryOfTheDay={setMemoryOfTheDay} />
			</div>
			<ViewMemoryV3
				modalTigger={triggerViewMemory}
				record={viewFeaturedMemory}
				deleteMemoryOfTheDay={deleteMemoryOfTheDay}
				isLoading={isLoading}
			/>
		</React.Fragment>
	);
};

export default MemoryOfTheDay;
