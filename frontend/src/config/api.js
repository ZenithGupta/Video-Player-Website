// Create a new file: frontend/src/config/api.js

// VM backend (current production/test backend)
// Set API_URL to your backend. For local dev/testing you can change this to the dev tunnel URL.
const API_URL = 'http://127.0.0.1:8000/api';

// If you want the embedded Google Form to capture the logged-in user's email,
// add the Google Form's prefill entry ids below for each language.
// Example prefill links you provided:
// English: https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.1823886876=test@example.com
// Tamil:   https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.28491091=test@example.com
const GOOGLE_FORM_ENTRY_IDS = {
	en: '1823886876',
	ta: '28491091'
};

export default API_URL;
export { GOOGLE_FORM_ENTRY_IDS };