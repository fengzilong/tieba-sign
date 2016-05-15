import ora from 'ora';

const spinner = ora({
	spinner: {
		interval: 100,
		frames: [ '' ],
	},
	color: 'white'
});

const spin = ( text ) => {
	spinner.text = text;
};

spin.render = () => {
	spinner.render();
};

spin.start = () => {
	spinner.text = '';
	spinner.start();
	spin.isStarted = true;
};

spin.stop = () => {
	spinner.stop();
	spinner.text = '';
	spin.isStarted = false;
};

export default spin;
