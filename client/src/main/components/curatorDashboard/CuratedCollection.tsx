import React, { useState, useEffect } from "react";

import axios from "axios";
import { RootState } from "../../redux/reducers/allReducer";
import { projectStorage } from "../../utilities/firebaseConfig";
import { IRecordWithCreator } from "../../redux/actionSchemas/recordSchema";

import ViewMemoryV3 from "../modals/ViewMemoryV2";

import uploadImageBtnV1 from "../../assets/images/buttons/uploadImageBtnV1.png";
import emptyPhotoV1 from "../../assets/images/logo/emptyPhotoV1.png";
import { useSelector } from "react-redux";

const CurratedCollection = () => {
	const userState = useSelector((state: RootState) => state.user);

	const [recordState, setRecordState] = useState<{ records: IRecordWithCreator[] }>({ records: [] });
	const [allCuratedCollection, setAllCuratedCollection] = useState<any>();

	const [selectRecord, setSelectRecord] = useState<any>([]);
	const [tabSelected, setTabSelected] = useState<string>("all memories");
	const [curationInformation, setCurationInformation] = useState<any>({ title: "", description: "", images: null, _id: "" });
	const [curationSelected, setCurationSelected] = useState<any>(null);

	// display uploaded images
	const [curationImages, setCurationImages] = useState<string[]>([]);
	const [curationImagesError, setCurationImagesError] = useState("");

	const [viewRecord, setViewRecord] = useState<IRecordWithCreator>();
	const [triggerViewMemory, setTriggerViewMemory] = useState(false);

	useEffect(() => {
		retrieveCompiledMemory();
		retrieveAllRecord();
	}, []);

	// fill the gap of 4 picture per column design to push the picture at the left side
	const renderEmptySelectionImages = (numberOfColumn: number, arrayLength: number, classStyle: string) => {
		// const numberOfColumn = 5;
		const emptySlots = [];

		// render an empty image to fill up the missing image to create a row
		if (arrayLength) {
			const numberOfEmptySlots = numberOfColumn - (arrayLength % 5);
			for (let a = 0; a < numberOfEmptySlots; a++) emptySlots.push(a);
			return emptySlots.map((item: any, index: number) => (
				<img src={emptyPhotoV1} alt="record empty" key={index} className={classStyle} />
			));
		}

		// render the number of coloum if empty
		for (let a = 0; a < numberOfColumn; a++) emptySlots.push(a);
		return emptySlots.map((item: any, index: number) => (
			<img src={emptyPhotoV1} alt="record empty" key={index} className={classStyle} />
		));
	};

	// ------------------------------- Display All Curated Collection -------------------------------
	const resetAllInputCollectionDetails = () => {
		setSelectRecord([]);
		setCurationInformation({ title: "", description: "", images: null, _id: "" });
		setCurationSelected(null);
		setCurationImages([]);
		setCurationImagesError("");
	};

	// set all collection details for editing stage
	const handleCollectionSelection = (collection: any) => {
		setCurationSelected(collection);

		const allRecords = [];
		for (let a = 0; a < collection.records.length; a++) allRecords.push(collection.records[a].record);
		setSelectRecord(allRecords);

		const allImages = [];
		for (let a = 0; a < collection.images.length; a++) allImages.push(collection.images[a].link);
		setCurationImages(allImages);

		setCurationInformation({
			title: collection.title,
			description: collection.description,
			images: collection.images,
			_id: collection._id,
		});
	};

	const DisplayAllCuratedCollection = () => (
		<div className="container-center">
			<div className="container-width-curator-dashboard">
				<div className="display-all-curation-parent">
					<div>
						<div className="header-container">
							<input
								type="button"
								value="Create New Collection"
								onClick={() => (curationSelected != null ? resetAllInputCollectionDetails() : console.log(""))}
								className={`cursor-point create-collection-btn-container ${
									curationInformation._id == "" ? "create-collection-btn-selected" : "create-collection-btn-idle"
								}`}
							/>
						</div>

						{allCuratedCollection?.map((collection: any, index: number) => (
							<div
								className={`cursor-point colection-container ${
									collection._id == curationInformation._id ? "colection-container-selected" : "colection-container-idle"
								}`}
								onClick={() => handleCollectionSelection(collection)}
								key={index}
							>
								<div className="collection-img-container">
									<img className="collection-img-container" src={collection.images[0].link} alt="record image" />
								</div>

								<div className="collection-info-container">
									<h1>{collection.title}</h1>
									<p>{collection.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
	// ------------------------------- Display All Curated Collection -------------------------------

	// ------------------------------- Tab Selection -------------------------------
	const handleTabSelection = () => {
		const allSelectedRecord = [];
		for (let a = 0; a < selectRecord.length; a++) allSelectedRecord.push({ record: selectRecord[a]._id });

		if (
			curationInformation.title &&
			curationInformation.description &&
			curationInformation.images.length &&
			allSelectedRecord.length
		) {
			const newItem = {
				title: curationInformation.title,
				description: curationInformation.description,
				images: curationInformation.images,
				records: allSelectedRecord,
				creator: userState._id,
			};
			if (curationInformation._id == "") createCompiledMemory(newItem);
			else updateCompiledRecord({ _id: curationInformation._id, updItem: newItem });
		} else console.log("Missing Field");
	};

	const TabSelection = () => (
		<div className="tab-selection-parent">
			<div className="tab-selection-container">
				<div className="tab-option" onClick={() => setTabSelected("all memories")}>
					<span className={tabSelected == "all memories" ? "tab-option-selected" : ""}></span>
					<span>All Memories</span>
				</div>
				<div className="tab-option" onClick={() => setTabSelected("selected memories")}>
					<span className={tabSelected == "selected memories" ? "tab-option-selected" : ""}></span>
					<span>Collected Memories</span>
				</div>
				<div className="tab-option" onClick={() => setTabSelected("curation information")}>
					<span className={tabSelected == "curation information" ? "tab-option-selected" : ""}></span>
					<span>Information</span>
				</div>
			</div>
			<div className="tab-details-container">
				<div className="tab-info">
					<p>
						<b> Title:</b> {curationSelected ? curationSelected.title : "New collection"}
					</p>
					<p>
						<b> ID:</b> {curationSelected ? curationSelected._id : "New collection"}
					</p>
				</div>
				<input type="button" value="Save Collection" onClick={handleTabSelection} className="save-collection-btn" />
			</div>
		</div>
	);

	const DisplayTab = () => {
		if (tabSelected == "all memories") return DisplayAllUserMemories();
		else if (tabSelected == "selected memories") return DisplayAllSelectedMemories();
		else if (tabSelected == "curation information") return DisplayCurationInformation();
	};
	// ------------------------------- Tab Selection -------------------------------

	// ------------------------------- Display All User Memories -------------------------------
	const DisplayAllUserMemories = () => (
		<div className="all-user-memory-center">
			<div className="all-user-memory-container">
				{recordState.records?.map((record: IRecordWithCreator, index: number) => (
					<div key={index} className="select-container">
						<div
							className={`cursor-point checkbox-container ${
								selectRecord.find((item: any) => item._id == record._id) ? "checkbox-active" : ""
							}`}
							onClick={() => {
								if (selectRecord.find((item: any) => item._id == record._id))
									setSelectRecord(selectRecord.filter((item: any) => item._id != record._id));
								else setSelectRecord([...selectRecord, record]);
							}}
						></div>
						<img
							className="cursor-point user-memory-img-container"
							src={record.images[0].link}
							alt="record image"
							onClick={() => {
								setTriggerViewMemory(!triggerViewMemory);
								setViewRecord(record);
							}}
						/>
					</div>
				))}
				{renderEmptySelectionImages(5, recordState.records?.length, "user-memory-img-container")}
			</div>
		</div>
	);

	// ------------------------------- Display All User Memories -------------------------------

	// ------------------------------- Display All Selected User Memories -------------------------------
	const DisplayAllSelectedMemories = () => (
		<div className="all-user-memory-center">
			<div className="all-user-memory-container">
				{recordState.records?.map((record: IRecordWithCreator, index: number) => {
					if (selectRecord.find((item: any) => item._id == record._id))
						return (
							<div key={index} className="select-container">
								<div
									className={`cursor-point checkbox-container ${
										selectRecord.find((item: any) => item._id == record._id) ? "checkbox-active" : ""
									}`}
									onClick={() => {
										if (selectRecord.find((item: any) => item._id == record._id))
											setSelectRecord(selectRecord.filter((item: any) => item._id != record._id));
										else setSelectRecord([...selectRecord, record]);
									}}
								></div>
								<img
									className="cursor-point user-memory-img-container"
									src={record.images[0].link}
									alt="record image"
									onClick={() => {
										setTriggerViewMemory(!triggerViewMemory);
										setViewRecord(record);
									}}
								/>
							</div>
						);
				})}
				{renderEmptySelectionImages(5, selectRecord?.length, "user-memory-img-container")}
			</div>
		</div>
	);

	// ------------------------------- Display All Selected User Memories -------------------------------

	// ------------------------------- Display Curation Information -------------------------------

	const UploadImage = () => (
		<div>
			<div className="img-spacing">
				{curationImages.map((image: string, index: number) => (
					<img src={image} key={index} alt="record" className="upload-img-container" />
				))}
				{renderEmptySelectionImages(4, curationImages.length, "upload-img-container")}
			</div>

			<div style={curationInformation._id == "" ? { display: "inherit" } : { display: "none" }}>
				<input
					type="file"
					name="record-image"
					id="record-image"
					className="hide-input"
					onChange={handleChangeFile}
					accept="image/png, image/jpeg"
					multiple
				/>
				<label htmlFor="record-image">
					<img src={uploadImageBtnV1} alt="upload button" className="cursor-point" />
				</label>
			</div>

			<div className="upload-error">{curationImagesError && <span>{curationImagesError}</span>}</div>
		</div>
	);

	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files;
		const maxByteSize = 4194304;
		let isValidInput = true;

		if (selected) {
			// checks if the images exceeds 4 photos
			if (selected.length > 4) {
				isValidInput = false;
				setCurationInformation({ ...curationInformation, images: null });
				setCurationImages([]);
				setCurationImagesError("The number of the image should not exceed to 4 images");
			} else {
				// checks all the image size if it exceeds 4MB
				for (let a = 0; a < selected.length; a++) {
					// console.log("multiple: ", selected[a].size); // Debug
					if (selected[a].size > maxByteSize) {
						isValidInput = false;
						setCurationInformation({ ...curationInformation, images: null });
						setCurationImages([]);
						setCurationImagesError("The size of the image should not exceed above 4MB");
						break;
					}
				}
			}
			if (isValidInput) {
				// Convert the iamges to url to display the selected image in client side
				const currentImage = [];
				for (let a = 0; a < selected.length; a++) if (selected[a]) currentImage.push(URL.createObjectURL(selected[a]));
				setCurationInformation({ ...curationInformation, images: selected });
				setCurationImages(currentImage);
				setCurationImagesError("");
				// console.log("isValidInput", isValidInput); // Debug
			}
		}
	};

	const DisplayCurationInformation = () => (
		<div className="display-curation-info-parent">
			<UploadImage />

			<input
				type="text"
				name="title"
				placeholder="Title"
				className="single-line-input-container"
				value={curationInformation.title}
				onChange={e => setCurationInformation({ ...curationInformation, title: e.target.value })}
			/>

			<textarea
				name="description"
				placeholder="Description"
				className="mutli-line-input-container"
				value={curationInformation.description}
				onChange={e => setCurationInformation({ ...curationInformation, description: e.target.value })}
			></textarea>
		</div>
	);

	// ------------------------------- Display Curation Information -------------------------------

	// ------------------------------- API handling -------------------------------
	const retrieveCompiledMemory = () => {
		axios
			.get(`/api/compiled-memory/details-record/`)
			.then(res => setAllCuratedCollection(res.data))
			.catch(err => console.log("err", err));
	};

	const retrieveAllRecord = () => {
		axios
			.get(`/api/records/record-creator`)
			.then(res => setRecordState({ records: res.data }))
			.catch(err => console.log("err", err));
	};

	const createCompiledMemory = (newItem: any) => {
		if (newItem.images) {
			const emptyRecord: any = {
				title: "",
				description: "",
				images: [],
				records: [],
				creator: newItem.creator,
			};

			// Create an empty instance of link object base on the number of image selected
			for (let a = 0; a < newItem.images.length; a++) emptyRecord.images.push({ link: "" });

			// Retrieving the object_id from the created empty instance and save image to cloud
			axios
				.post("/api/compiled-memory", emptyRecord)
				.then(res => saveImageToCloud(newItem, res.data))
				.catch(err => console.log("err", err)); // Debug
		}
	};

	const saveImageToCloud = (newItem: any, emptyRecord: any) => {
		if (newItem.images) {
			let imageLinks: string[] = [];
			const imageCount = newItem.images.length;

			// loop all the selected images
			for (let a = 0; a < imageCount; a++) {
				// console.log(newItem.image[a]); // Debug

				// name the image using the _id from database
				const storageRef = projectStorage.ref(emptyRecord.images[a]._id);

				// Store the images in the firebase cloud storage
				storageRef
					.put(newItem.images[a])
					.then(res => {
						if (res.state === "success")
							// Retrive the image link that will be saved in the database as link
							storageRef
								.getDownloadURL()
								.then((storageURL: string) => {
									imageLinks.push(storageURL);
									// console.log(storageURL, imageLinks.length, imageCount) // Debug
									// save the created record if all of the image is saved in cloud
									if (imageLinks.length === imageCount) saveCreatedRecordToDatabase(newItem, emptyRecord, imageLinks);
								})
								.catch(err => console.log("err", err)); // Debug
					})
					.catch(err => console.log("err", err)); // Debug
			}
		}
	};

	const saveCreatedRecordToDatabase = (newItem: any, emptyRecord: any, imageLinks: string[]) => {
		let newRecord: any = {
			_id: emptyRecord._id,
			updItem: {
				title: newItem.title,
				description: newItem.description,
				images: [],
				records: newItem.records,
				creator: newItem.creator,
			},
		};

		for (let a = 0; a < imageLinks.length; a++)
			newRecord.updItem.images.push({ _id: emptyRecord.images[a]._id, link: imageLinks[a] });

		axios
			.put("/api/compiled-memory/", newRecord)
			.then(() => {
				retrieveCompiledMemory();
				resetAllInputCollectionDetails();
			})
			.catch(err => console.log("err", err)); // Debug
	};

	const updateCompiledRecord = (updatedItem: { _id: string; updItem: any }) => {
		axios
			.put("/api/compiled-memory/", updatedItem)
			.then(() => {
				retrieveCompiledMemory();
				resetAllInputCollectionDetails();
			})
			.catch(err => console.log("err", err)); // Debug
	};
	// ------------------------------- API handling -------------------------------

	return (
		<div className="curated-collection-parent">
			<ViewMemoryV3 modalTigger={triggerViewMemory} record={viewRecord} />
			<DisplayAllCuratedCollection />
			<TabSelection />
			<div style={tabSelected == "all memories" ? { display: "inherit" } : { display: "none" }}>
				<DisplayAllUserMemories />
			</div>
			<div style={tabSelected == "selected memories" ? { display: "inherit" } : { display: "none" }}>
				<DisplayAllSelectedMemories />
			</div>
			<div style={tabSelected == "curation information" ? { display: "inherit" } : { display: "none" }}>
				{DisplayCurationInformation()}
			</div>
		</div>
	);
};

export default CurratedCollection;
