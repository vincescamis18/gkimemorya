import React from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
	curatedCollections: any;
}

const DisplayCuratedCollectionV2 = (props: IProps) => {
	const navigate = useNavigate();

	return (
		<div className="curated-collection-parent">
			<div className="display-all-curation-parent">
				<div>
					{props.curatedCollections?.map((collection: any, index: number) => (
						<div
							className="cursor-point colection-container colection-container-idle"
							onClick={() => navigate(`/collection/${collection._id}`)}
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
			{props.curatedCollections?.length > 0 ? <></> : <h1 className="txt-grey">No Curated Collection Found</h1>}
		</div>
	);
};

export default DisplayCuratedCollectionV2;
