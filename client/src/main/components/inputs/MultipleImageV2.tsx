import React, { useEffect, useState } from "react";

import { INewRecordInput } from "../../redux/actionSchemas/recordSchema";
import uploadImageBtnV1 from "../../assets/images/buttons/uploadImageBtnV1.png";
import emptyPhotoV1 from "../../assets/images/logo/emptyPhotoV1.png";

interface IProps {
	setNewRecord: React.Dispatch<React.SetStateAction<INewRecordInput>>;
	newRecord: INewRecordInput;
}

const MultipleImageV2 = (props: IProps) => {
	const [images, setImages] = useState<string[]>([]);
	const [error, setError] = useState("");

	// remove the display if the value is reset
	useEffect(() => {
		if (props.newRecord.images === null) setImages([]);
	}, [props.newRecord.images]);

	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files;
		const maxByteSize = 4194304;
		let isValidInput = true;

		if (selected) {
			// checks if the images exceeds 4 photos
			if (selected.length > 4) {
				isValidInput = false;
				props.setNewRecord({ ...props.newRecord, images: null });
				setImages([]);
				setError("The number of the image should not exceed to 4 images");
			} else {
				// checks all the image size if it exceeds 4MB
				for (let a = 0; a < selected.length; a++) {
					// console.log("multiple: ", selected[a].size); // Debug
					if (selected[a].size > maxByteSize) {
						isValidInput = false;
						props.setNewRecord({ ...props.newRecord, images: null });
						setImages([]);
						setError("The size of the image should not exceed above 4MB");
						break;
					}
				}
			}
			if (isValidInput) {
				// Convert the iamges to url to display the selected image in client side
				const currentImage = [];
				for (let a = 0; a < selected.length; a++) if (selected[a]) currentImage.push(URL.createObjectURL(selected[a]));
				props.setNewRecord({ ...props.newRecord, images: selected });
				setImages(currentImage);
				setError("");
				// console.log("isValidInput", isValidInput); // Debug
			}
		}
	};

	const renderEmptyImage = () => {
		// render an empty image to each missing photo in the row
		let render = [];
		for (let a = 0; a < 4 - images.length; a++) render.push(a);
		return render.map((item, index) => <img src={emptyPhotoV1} key={index} alt="upload button" />);
	};

	return (
		<div>
			<input
				type="file"
				name="record-image"
				id="record-image"
				className="hide-input"
				onChange={handleChangeFile}
				accept="image/png, image/jpeg"
				multiple
			/>

			<div></div>
			<div className="image-layout-container">
				{images.map((image: string, index: number) => (
					<img src={image} key={index} alt="record" className="image-container" />
				))}
				{renderEmptyImage()}
			</div>
			<div className="error-msg">{error && <span>{error}</span>}</div>
			<label htmlFor="record-image">
				<img src={uploadImageBtnV1} alt="upload button" className="upload-button" />
			</label>
		</div>
	);
};

export default MultipleImageV2;
