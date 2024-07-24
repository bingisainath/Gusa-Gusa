const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function getUserDetails(request,response){
    try {
        const token = request.cookies.token || ""

        // console.log("Tokeb :",token);

        const user = await getUserDetailsFromToken(token)

        // console.log("User :",user);

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