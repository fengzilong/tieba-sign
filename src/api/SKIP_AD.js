import request from '../request';

export default () => {
	return new Promise(function(resolve, reject) {
		request({
			url: 'http://tieba.baidu.com/mo/'
		}, ( error, response, body ) => {
			resolve();
		});
	});
};
