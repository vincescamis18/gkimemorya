import React, { useEffect } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

import { useDispatch } from "react-redux";
import { fetchUser, retrieveLoginCredential } from "./main/redux/actions/userAction";
import { fetchUserAccess } from "./main/redux/actions/userAccessAction";

import Origin from "./main/pages/Origin";
import Home from "./main/pages/Home";
import Item from "./main/pages/Item";
import Zample from "./main/pages/Zample";
import Record from "./main/pages/Record";
import ManageUser from "./main/pages/ManageUser";
import User from "./main/pages/User";
import VisitUser from "./main/pages/VisitUser";
import Register from "./main/pages/Register";
import UploadMemory from "./main/pages/UploadMemory";
import EditMemory from "./main/pages/EditMemory";
import Explore from "./main/pages/Explore";
import ExploreV2 from "./main/pages/ExploreV2";
import CuratorDashboard from "./main/pages/CuratorDashboard";
import CuratedCollection from "./main/pages/ViewCuratedCollection";
import MemoryView from "./main/pages/MemoryView";
import SearchResult from "./main/pages/SearchResult";
import PrivacyPolivy from "./main/pages/PrivacyPolivy";

import ScrollToTop from "./main/utilities/scrollToTop";

function App() {
	const dispatch = useDispatch();

	const getUser = () => {
		const token = localStorage.getItem("auth-token");
		if (!token) dispatch(retrieveLoginCredential());
		else {
			dispatch(fetchUser());
			dispatch(fetchUserAccess());
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<HashRouter>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Origin" element={<Origin />} />
				<Route path="/item" element={<Item />} />
				<Route path="/zample" element={<Zample />} />
				<Route path="/record" element={<Record />} />
				<Route path="/memory/:id" element={<MemoryView />} />
				<Route path="/manage_user" element={<ManageUser />} />
				<Route path="/profile" element={<User />} />
				<Route path="/profile/:id" element={<VisitUser />} />
				<Route path="/register" element={<Register />} />
				<Route path="/upload-memory" element={<UploadMemory />} />
				<Route path="/edit-memory/:id" element={<EditMemory />} />
				<Route path="/explore" element={<ExploreV2 />} />
				<Route path="/dashboard" element={<CuratorDashboard />} />
				<Route path="/collection/:id" element={<CuratedCollection />} />
				<Route path="/search/:searchWord" element={<SearchResult />} />
				<Route path="/privacy-policy" element={<PrivacyPolivy />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
