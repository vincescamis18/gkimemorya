import React, { useState, useEffect } from "react";

import axios from "axios";
import { IRecordWithCreator } from "../redux/actionSchemas/recordSchema";
import { useParams } from "react-router-dom";

import ViewMemoryV2 from "../components/modals/ViewMemoryV2";
import NavbarV1 from "../components/headers/NavbarV1";

import EmptyV1 from "../assets/images/icons/emptyV3.png";
import DisplayCuratedCollectionV2 from "../components/displayCuratedCollection/DisplayCuratedCollectionV2";

const SearchResultPage = () => {
	const { searchWord } = useParams();

	const [memoryFiltered, setMemoryFiltered] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [collectionFiltered, setCollectionFiltered] = useState<any>();

	const [memoryFilteredByTitle, setMemoryFilteredByTitle] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [collectionFilteredByTitle, setCollectionFilteredByTitle] = useState<any>();

	const [memoryFilteredByLocation, setMemoryFilteredByLocation] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [collectionFilteredByLocation, setCollectionFilteredByLocation] = useState<any>();

	const [memoryFilteredByDate, setMemoryFilteredByDate] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [collectionFilteredByDate, setCollectionFilteredByDate] = useState<any>();

	// const [searchWord, setSearchWord] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [location, setLocation] = useState("");

	const [showMemory, setShowMemory] = useState(true);
	const [showCollection, setShowCollection] = useState(true);

	const [viewRecord, setViewRecord] = useState<IRecordWithCreator>();
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	useEffect(() => {
		if (searchWord) {
			retriveRecordByTitle();
			retriveCompilationByTitle();
		}
	}, [searchWord]);

	// updating the combination of all the filter if one filter is change
	useEffect(() => {
		const combinedFilted: IRecordWithCreator[] = [];

		if (startDate && endDate && memoryFilteredByDate.records && location && memoryFilteredByLocation.records) {
			// both date and location is filtered

			memoryFilteredByTitle.records.forEach((item: any) => {
				if (
					memoryFilteredByDate.records.find(dateFilted => dateFilted._id == item._id) &&
					memoryFilteredByLocation.records.find(dateFilted => dateFilted._id == item._id)
				)
					combinedFilted.push(item);
			});

			setMemoryFiltered({ records: combinedFilted });
		} else if (startDate && endDate && memoryFilteredByDate.records) {
			// only date is filtered

			memoryFilteredByTitle.records.forEach((item: IRecordWithCreator) => {
				if (memoryFilteredByDate.records.find(dateFilted => dateFilted._id == item._id)) combinedFilted.push(item);
			});

			setMemoryFiltered({ records: combinedFilted });
		} else if (location && memoryFilteredByLocation.records) {
			// only location is filtered

			memoryFilteredByTitle.records.forEach((item: IRecordWithCreator) => {
				if (memoryFilteredByLocation.records.find(dateFilted => dateFilted._id == item._id)) combinedFilted.push(item);
			});

			setMemoryFiltered({ records: combinedFilted });
		} else setMemoryFiltered(memoryFilteredByTitle); // both date and location is not filtered
	}, [memoryFilteredByLocation, memoryFilteredByDate, memoryFilteredByTitle]);

	useEffect(() => setCollectionFiltered(collectionFilteredByTitle), [collectionFilteredByTitle]);
	useEffect(() => setCollectionFiltered(collectionFilteredByDate), [collectionFilteredByDate]);

	const retriveRecordByTitle = () => {
		console.log(searchWord);
		axios
			.get(`/api/records/search/title/${searchWord ? searchWord : ""}`)
			.then(res => setMemoryFilteredByTitle({ records: res.data }))
			.catch(err => console.log("err", err));
	};

	const retriveCompilationByTitle = () => {
		console.log(searchWord);
		axios
			.get(`/api/compiled-memory/search/title/${searchWord ? searchWord : ""}`)
			.then(res => setCollectionFilteredByTitle(res.data))
			.catch(err => console.log("err", err));
	};

	const handleFilterSelection = (e: any) => {
		// atleast one fitler should be checked
		switch (e.target.name) {
			case "filter-memory":
				if (!showMemory || showCollection) setShowMemory(!showMemory);
				break;

			case "filter-collection":
				if (showMemory || !showCollection) setShowCollection(!showCollection);
				break;
		}
	};

	const handleDateRangeSubmit = () => {
		if (startDate && endDate) {
			console.log(startDate, endDate);
			axios
				.get(`/api/records/filter/date/${startDate}/${endDate}`)
				.then(res => setMemoryFilteredByDate({ records: res.data }))
				.catch(err => console.log("err", err));

			axios
				.get(`/api/compiled-memory/filter/date/${startDate}/${endDate}`)
				.then(res => setCollectionFilteredByDate(res.data))
				.catch(err => console.log("err", err));
		}
	};

	const handleLocationSubmit = () => {
		if (location) {
			console.log(location);
			axios
				.get(`/api/records/filter/location/${location}`)
				.then(res => setMemoryFilteredByLocation({ records: res.data }))
				.catch(err => console.log("err", err));
		}
	};

	// fill the gap of 4 picture per column design to push the picture at the left side
	const emptyImages = () => {
		if (memoryFiltered.records?.length) {
			const numberOfEmptySlots = 5 - (memoryFiltered.records?.length % 5);
			const emptySlots = [];
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={EmptyV1} alt="record empty" key={index} className="search-result-display-container" />
			));
		}
	};

	const DisplayUserAllMemories = () => (
		<div className="search-result-center">
			<div className="search-result-container">
				{memoryFiltered.records?.length > 0 ? (
					memoryFiltered.records?.map((record: IRecordWithCreator, index: number) => (
						<div key={index} className="checkbox-memory-container">
							<img
								className="cursor-point search-result-display-container"
								src={record.images[0].link}
								alt="record image"
								onClick={() => selectMemory(record)}
							/>
						</div>
					))
				) : (
					<h1 className="txt-grey">No Memories Found</h1>
				)}
				{emptyImages()}
			</div>
		</div>
	);

	const selectMemory = (record: IRecordWithCreator) => {
		setTriggerViewMemory(!triggerViewMemory);
		setViewRecord(record);
	};

	const SideDashboard = () => (
		<React.Fragment>
			<div className="side-memu-spacing"></div>
			<div className="side-menu-container no-select">
				<div className="side-menu-title no-select">
					<span>Search results</span>
				</div>
				<div className="ml-10">
					<div className="side-menu-section">
						<h4>Include</h4>
						<div>
							<input
								type="checkbox"
								name="filter-memory"
								id="filter-memory"
								checked={showMemory}
								onChange={handleFilterSelection}
							/>
							<span className="ml-10">Memory</span>
						</div>
						<div>
							<input
								type="checkbox"
								name="filter-collection"
								id="filter-collection"
								checked={showCollection}
								onChange={handleFilterSelection}
							/>
							<span className="ml-10">Curated Collection</span>
						</div>
					</div>

					<div className="side-menu-section">
						<h4>Date Range</h4>
						<input type="date" name="start-date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
						<span className="ml-10">Start</span>

						<input type="date" name="end-date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} />
						<span className="ml-10">End</span>

						<br />
						<input type="button" value="Apply" className="apply-btn" onClick={handleDateRangeSubmit} />
					</div>

					<div className="side-menu-section">
						<h4>Location</h4>
						<input type="text" name="location" id="location" value={location} onChange={e => setLocation(e.target.value)} />

						<br />
						<input type="button" value="Apply" className="apply-btn" onClick={handleLocationSubmit} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<NavbarV1 />
			<ViewMemoryV2 modalTigger={triggerViewMemory} record={viewRecord} />
			<div className="search-result-parent">
				{SideDashboard()}

				<div className="filter-result-container">
					<div style={showMemory ? { display: "inherit" } : { display: "none" }}>
						<div className="filter-result-border"></div>
						<p className="filter-result-title">Memories</p>
						<DisplayUserAllMemories />
					</div>

					<div style={showCollection ? { display: "inherit" } : { display: "none" }}>
						<div className="filter-result-border"></div>
						<p className="filter-result-title">Curated Stories</p>
						<DisplayCuratedCollectionV2 curatedCollections={collectionFiltered} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SearchResultPage;
