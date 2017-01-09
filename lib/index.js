require( './log' )();

module.exports = {
	Service: require( './api' ),
	createJar: require( './createJar' ),
	service: {
		getlikes: require( './service/get_likes' ),
		sign: require( './service/sign' ),
		getProfile: require( './service/get_profile' ),
		skipAd: require( './service/skip_ad' ),
	},
	cache: {
		loadCookie: require( './cache/loadCookie' ),
		saveCookie: require( './cache/saveCookie' ),
	}
};
