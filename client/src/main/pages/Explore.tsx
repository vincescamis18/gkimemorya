import React, { useEffect, useState } from "react";

import DisplayAllMemoryV1 from "../components/displayMemories/DisplayAllMemoryV1";
import DisplayMemoryOfTheDayV1 from "../components/displayMemories/DisplayMemoryOfTheDayV1";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Explore: React.FC = () => {
	const navigate = useNavigate();
	const [allCuratedCollection, setAllCuratedCollection] = useState<any>();

	useEffect(() => {
		axios
			.get(`/api/compiled-memory/details-record/`)
			.then(res => setAllCuratedCollection(res.data))
			.catch(err => console.log("err", err));
	}, []);

	const DisplayAllCuratedCollection = () => (
		<div className="container-center">
			<div className="container-width-explore">
				<div className="curated-collection-parent">
					<div className="display-all-curation-parent">
						<div>
							{allCuratedCollection?.map((collection: any, index: number) => (
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
				</div>
			</div>
		</div>
	);

	return (
		<div className="explore">
			<DisplayMemoryOfTheDayV1 />
			<DisplayAllCuratedCollection />
			<DisplayAllMemoryV1 userId={""} />
		</div>
	);
};

export default Explore;
