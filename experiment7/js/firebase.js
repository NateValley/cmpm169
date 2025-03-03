const firebaseConfig = {
	apiKey: "AIzaSyBHDnnb_x3mputGPmZ2yVaFexnUTENZOBU",
	authDomain: "beatpass-dfeae.firebaseapp.com",
	projectId: "beatpass-dfeae",
	storageBucket: "beatpass-dfeae.firebasestorage.app",
	messagingSenderId: "203129825032",
	appId: "1:203129825032:web:404659ff186c4c10f6aebd",
	measurementId: "G-Y5P5FRJ3Q0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const saveTrack = async (userID, city, recentTrack) => {
	
	try {

		await db.collection("beatpass-lite").add({
			userID: userID,
			city: city,
			trackName: recentTrack.name,
			trackArtist: recentTrack.artists[0].name,
			trackURL: recentTrack.external_urls.spotify,
			timestamp: firebase.firestore.Timestamp.now()
		});

		console.log("Track saved successfully!");

	} catch (e) {
		console.error("Error adding track:", e);
	}
}

document.getElementById("log-track-button").addEventListener("click", function () {
	saveTrack(window.userData.display_name, window.userCity, window.recentlyPlayedData.items[0].track);
});

const displayCityData = async (city) => {
	const trackListContainer = document.getElementById("city-tracks");

	trackListContainer.innerHTML = "";

	try {
		const snapshot = await db.collection("beatpass-lite")
			.where("city", "==", city)
			.orderBy("timestamp", "asc")
			.limit(5)
			.get();
		
		if ( snapshot.empty ) {
			trackListContainer.innerHTML = "<p>No recent tracks logged in this city!</p>"
			return;
		}

		snapshot.forEach(doc => {
			const logData = doc.data();

			const trackElement = document.createElement("div");
			trackElement.classList.add("track-item");

			trackElement.innerHTML = `
				<p><strong>${logData.userID}</strong> logged this track in <strong>${logData.city}</strong></p>
        		<p><a href="${logData.trackURL}" target="_blank">${logData.trackName}</a> by ${logData.trackArtist}</p>
        		<p>Logged at: ${logData.timestamp.toDate().toLocaleString()}</p>
      		`;

			trackListContainer.appendChild(trackElement);
		});

	} catch (e) {
		console.error("Error fetching city tracks:", e);
	}
}

document.getElementById("refresh-city-button").addEventListener("click", function () {
	displayCityData(window.userCity);
});