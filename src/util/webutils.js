const fetch = require('node-fetch')

class utils {
    static async checkOwnership(code) {
        let authToken = await utils.authCodeToAuthToken(code);
        let xbl = await utils.authTokenToXBL(authToken);
        let xsts = await utils.xblToXsts(xbl);
        let mcToken = await utils.xstsToMc(xsts);
        let games = await utils.getGames(mcToken);
        
		if(!games) return false

		for (let i = 0; i < games.length; i++){
			if(games[i].name == 'game_minecraft') return true
		}
        
        return false
    }

    static async authCodeToAuthToken(code) {
		let bodyAcess = {
			client_id: process.env.clientId,
			client_secret: process.env.clientSecret,
			code: code,
			grant_type: "authorization_code",
			redirect_uri: process.env.redirectUri
		}

		var formBody = [];
		for (var property in bodyAcess) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(bodyAcess[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		formBody = formBody.join("&");

		const request = await fetch(`https://login.live.com/oauth20_token.srf`, {
			method: 'post',
			body: formBody,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
		
		const acessToken = await request.json()
		const token = `d=${acessToken.access_token}`
		return token;
	}

	static async authTokenToXBL(authToken) {
		let data = {
			"Properties": {
				"AuthMethod": "RPS",
				"SiteName": "user.auth.xboxlive.com",
				"RpsTicket": authToken
			},
			"RelyingParty": "http://auth.xboxlive.com",
			"TokenType": "JWT"
		};

		const request = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
			method: 'post',
			body: JSON.stringify(data),
			headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
		})

		const dataXbox = await request.json()
		return dataXbox.Token;
	}

	static async xblToXsts(token) {
		let data = {
			"Properties": {
				"SandboxId": "RETAIL",
				"UserTokens": [
					token
				]
			},
			"RelyingParty": "rp://api.minecraftservices.com/",
			"TokenType": "JWT"
		};

		const request = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
			method: 'post',
			body: JSON.stringify(data),
			headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
		});

		const tokenXSTS = await request.json()
		return tokenXSTS;
	}

	static async xstsToMc(token) {
		let data = {"identityToken" : `XBL3.0 x=${token.DisplayClaims.xui[0].uhs};${token.Token}`,"ensureLegacyEnabled" : true};
		const request = await fetch('https://api.minecraftservices.com/authentication/login_with_xbox', {
			method: 'post',
			body: JSON.stringify(data),
			headers: {'Content-Type': 'application/json'}
		})

		const mineToken = await request.json()
		return mineToken.access_token
	}

	static async getGames(mc_token) {
		const request = await fetch('https://api.minecraftservices.com/entitlements/mcstore', {
			method: 'get',
			headers: {'Authorization': 'Bearer '+ mc_token}
		})

		const dataCheckCopy = await request.json()
		return dataCheckCopy.items
	}
}

module.exports = utils