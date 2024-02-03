module.exports = {
	apps: [
		{
			script: "npm start",
		},
	],

	deploy: {
		production: {
			key: "EC2.pem",
			user: "ubuntu",
			host: "3.92.186.123",
			ref: "origin/main",
			repo: "git@github.com:alishuaib/ngs.matoi.ca.git",
			path: "/home/ubuntu",
			"pre-deploy-local": "",
			"post-deploy":
				"source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
			"pre-setup": "",
			ssh_options: "ForwardAgent=yes",
		},
	},
}
