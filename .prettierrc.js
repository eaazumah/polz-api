module.exports = {
	singleQuote: false,
	tabWidth: 4,
	overrides: [
		{
			files: '*.ts',
			options: {
				tabWidth: 4
			}
		},
		{
			files: '*.json',
			options: {
				tabWidth: 6
			}
		}
	]
};
