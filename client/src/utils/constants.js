export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = `${HOST}/api/auth`;
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`; 
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE =  `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE_ROUTE =  `${AUTH_ROUTES}/add-profile-image`
export const REMOVE_PROFILE_IMAGE_ROUTE =  `${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`

export const CONTACT_ROUTES = `${HOST}/api/contacts`
export const SEARCH_ROUTE = `${CONTACT_ROUTES}/search`
export const GET_CONTACTS_ROUTE = `${CONTACT_ROUTES}/get-contact-for-dm`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTES}/get-all-contacts`

export const MESSAGE_ROUTES = `${HOST}/api/messages`
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`
export const UPLOAD_FILES_ROUTE = `${MESSAGE_ROUTES}/upload-file`

export const CHANNEL_ROUTE = `${HOST}/api/channel`
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTE}/get-user-channels`
export const GET_CHANNEl_MESSAGES = `${CHANNEL_ROUTE}/get-channel-messages`