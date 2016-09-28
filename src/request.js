import request from 'request';
import jar from './jar';

export default request.defaults({ jar: jar() });
