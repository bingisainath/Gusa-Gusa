const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function getUserDetails(request,response){
    try {
        let token = request.cookies.token || request.headers.authorization;

        console.log("getUserDetails token :",token);

        // Handle the case when the token comes with "Bearer "
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // Extract the token part after "Bearer "
        }

        const user = await getUserDetailsFromToken(token)

        console.log("getUserDetails :",user);

        return response.status(200).json({
            message : "user details",
            data : user
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = getUserDetails