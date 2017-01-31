require( './log' )();

module.exports = {
	Service: require( './api' ),
	createJar: require( './createJar' ),
	service: {
		getlikes: require( './service/get_likes' ),
		getlikesFast: require( './service/get_likes_fast' ),
		sign: require( './service/sign' ),
		getProfile: require( './service/get_profile' ),
		skipAd: require( './service/skip_ad' ),
	},
};
