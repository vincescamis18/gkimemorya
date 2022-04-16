import React, { useEffect, useState } from "react";

import NavbarV1 from "../components/headers/NavbarV1";
import DisplayAllMemoryV1 from "../components/displayMemories/DisplayAllMemoryV1";
import DisplayAllUsersV1 from "../components/displayUsers/DisplayAllUsersV1";
import DisplayCuratedCollectionV1 from "../components/displayCuratedCollection/DisplayCuratedCollectionV1";

const ExploreV2: React.FC = () => {
	const [selectedTab, setSelectedTab] = useState("Memories");

	const TabSelection = () => (
		<div className="center-tab-parent">
			<div className="tab-parent-container no-select">
				<div className="tab-option" onClick={() => setSelectedTab("Memories")}>
					{selectedTab == "Memories" ? <span className="tab-option-selected"></span> : <span></span>}
					<span>Memories</span>
				</div>
				<div className="tab-option" onClick={() => setSelectedTab("Curated Collection")}>
					{selectedTab == "Curated Collection" ? <span className="tab-option-selected"></span> : <span></span>}
					<span>Curated Collections</span>
				</div>
				<div className="tab-option" onClick={() => setSelectedTab("Contributors")}>
					{selectedTab == "Contributors" ? <span className="tab-option-selected"></span> : <span></span>}
					<span>Contributors</span>
				</div>
			</div>
		</div>
	);
	
	return (
		<div className="explore">
			<NavbarV1 />
			<TabSelection />
			{selectedTab == "Memories" ? <DisplayAllMemoryV1 userId={""} /> : <span></span>}
			{selectedTab == "Curated Collection" ? <DisplayCuratedCollectionV1 /> : <span></span>}
			{selectedTab == "Contributors" ? <DisplayAllUsersV1 /> : <span></span>}
		</div>
	);
};

export default ExploreV2;
