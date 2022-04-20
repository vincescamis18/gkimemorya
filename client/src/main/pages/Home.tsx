import React from "react";import NavbarV1 from "../components/headers/NavbarV1";
import DisplayMemoryOfTheDayV1 from "../components/displayMemories/DisplayMemoryOfTheDayV1";

const Home: React.FC = () => {
	return (
		<div className="home">
			<NavbarV1 />
			<DisplayMemoryOfTheDayV1 />
			<div className="center">
				<div className="section-container-01">
					<div className="memorya-section01-item01-container">
						<h1>MEMORYA PH</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
							aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
							sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
					<div className="image-container-bg">
						<img
							className="memorya-section01-item02-container"
							src="https://firebasestorage.googleapis.com/v0/b/memorya-c1e3e.appspot.com/o/621590abf2ed0a0016ef016c?alt=media&token=585dbf8c-9b41-4f95-9279-94d1402528bd"
							alt="groupo kalinanganicon"
						/>
					</div>
				</div>
			</div>

			<div className="section-border"></div>

			<div className="center">
				<div className="section-container-02">
					<div className="memorya-section02-item01-container">
						<h1>GRUPO KALINANGAN</h1>
						<p className="description-section02-item01">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
							aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
							sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
					<div className="image-container-bg">
						<img
							className="memorya-section02-item02-container"
							src="https://firebasestorage.googleapis.com/v0/b/memorya-c1e3e.appspot.com/o/621590abf2ed0a0016ef016c?alt=media&token=585dbf8c-9b41-4f95-9279-94d1402528bd"
							alt="groupo kalinanganicon"
						/>
					</div>
					<div className="memorya-section02-item03-container">
						<h1>PASIG TOURISM OFFICE</h1>
						<p className="description-section02-item02">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
							aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
							sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
				</div>
			</div>
			<div style={{ padding: "100px" }}></div>
		</div>
	);
};

export default Home;
