const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        //console.log(token);

        
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        console.log("1-> " + decoded);
        console.log("2-> " + decoded.email);
        req.userData = decoded;
       
        
        
    }
    catch(error){
        res.status(401).json({
            message: "Token invalid or expired"
        })
    }
    next();
}