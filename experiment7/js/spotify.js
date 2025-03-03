const CLIENT_ID = APIController.getClientID();
const REDIRECT_URI = 'http://localhost:5500/experiment7/index.html'; // Change this to your actual redirect URI
const SCOPES = 'user-read-private user-read-recently-played';

const loginButton = document.getElementById("login-button");

// User Info
const userInfo = document.getElementById("user-info");
const usernameDisplay = document.getElementById("username");
const profilePic = document.getElementById("profile-pic");

// Recently Played Info
const recentlyPlayed = document.getElementById("recent-tracks");
const recentDisplay = document.getElementById("most-recent");
const recentPic = document.getElementById("most-recent-pic");

const getTokenFromURL = () => {
	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);
	return params.get("access_token");
}

// Tokens (Access and Expiration)
let accessToken = localStorage.getItem("spotify_token") || getTokenFromURL();
let tokenExpiration = localStorage.getItem("spotify_token_expiration");

const newToken = getTokenFromURL();
if ( newToken ) {
	accessToken = newToken;
	tokenExpiration = Date.now() + 3600 * 1000;	// Sets expiration to 1 hour from now
	
	// Token storage
	localStorage.setItem("spotify_token", accessToken);
	localStorage.setItem("spotify_token_expiration", tokenExpiration);

	// Remove token from URL
	window.history.replaceState( {}, document.title, window.location.pathname );
}

if ( !accessToken || Date.now() > tokenExpiration ) {
	
	console.warn("Access token missing or expired! Redirecting to login...");
	localStorage.removeItem("spotify_token");
	localStorage.removeItem("spotify_token_expiration");

	// Display login button and hide user info
	loginButton.style.display = "block";
	userInfo.style.display = "none";

} else {

	// Hide login button and display user info
	loginButton.style.display = "none";
	userInfo.style.display = "block";

	// Fetch User Profile
	APIController.getUserProfile(accessToken)
		.then(data => {
			usernameDisplay.textContent = data.display_name || "Spotify User";
			
			if ( data.images.length > 0 ) {
				profilePic.src = data.images[0].url;
			}

			displayRecentlyPlayed();

			window.userData = data;
		})
		.catch(err => console.error("Error fetching user data:", err));
}

// Login Function
const loginSpotify = () => {
	const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
}

loginButton.addEventListener("click", loginSpotify);

// Fetch and display recently played tracks
const displayRecentlyPlayed = () => {
	
	recentlyPlayed.style.display = "block";
	
	APIController.getRecentlyPlayed(accessToken, 1)
		.then(data => {
			if ( data.items.length > 0 ) {
				recentDisplay.textContent = (data.items[0].track.name + ", by " + data.items[0].track.artists[0].name) || "Spotify Track";
				recentPic.src = data.items[0].track.album.images[0].url;
				
				window.recentlyPlayedData = data;
			}
			
			return data;
		})
		.catch(err => console.error("Error fetching recently played track data:", err));
}
