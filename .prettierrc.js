module.exports = {
	singleQuote: true,
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
