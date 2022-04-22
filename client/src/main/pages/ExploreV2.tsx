import React, { useState } from "react";

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
					<span className={selectedTab === "Memories" ? "tab-option-selected" : ""}></span>
					<span>Memories</span>
				</div>
				<div className="tab-option" onClick={() => setSelectedTab("Curated Collection")}>
					<span className={selectedTab === "Curated Collection" ? "tab-option-selected" : ""}></span>
					<span>Curated Collections</span>
				</div>
				<div className="tab-option" onClick={() => setSelectedTab("Contributors")}>
					<span className={selectedTab === "Contributors" ? "tab-option-selected" : ""}></span>
					<span>Contributors</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className="explore">
			<NavbarV1 />
			<TabSelection />

			<span style={selectedTab === "Memories" ? { display: "inherit" } : { display: "none" }}>
				<DisplayAllMemoryV1 userId={""} />
			</span>

			<span style={selectedTab === "Curated Collection" ? { display: "inherit" } : { display: "none" }}>
				<DisplayCuratedCollectionV1 />
			</span>

			<span style={selectedTab === "Contributors" ? { display: "inherit" } : { display: "none" }}>
				<DisplayAllUsersV1 />
			</span>
		</div>
	);
};

export default ExploreV2;
