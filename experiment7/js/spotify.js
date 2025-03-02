const CLIENT_ID = APIController.getClientID();
const REDIRECT_URI = 'http://localhost:5500/experiment7/index.html'; // Change this to your actual redirect URI
const SCOPES = 'user-read-private user-read-recently-played';

const loginButton = document.getElementById("login-button");
const userInfo = document.getElementById("user-info");
const usernameDisplay = document.getElementById("username");

const getTokenFromURL = () => {
	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);
	return params.get("access_token");
}

const accessToken = localStorage.getItem("spotify_token") || getTokenFromURL();

if ( accessToken ) {
	localStorage.setItem("spotify_token", accessToken);
	window.history.replaceState( {}, document.title, window.location.pathname );

	loginButton.style.display = "none";
	userInfo.style.display = "block";

	// Fetch User Profile
	APIController.getUserProfile(accessToken)
		.then(data => {
			usernameDisplay.textContent = data.display_name || "Spotify User";
		})
		.catch(err => console.error("Error fetching user data:", err));
} else {
	loginButton.style.display = "block";
	userInfo.style.display = "none";
}

// Login Function
const loginSpotify = () => {
	const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
}

document.getElementById("login-button").addEventListener("click", loginSpotify);