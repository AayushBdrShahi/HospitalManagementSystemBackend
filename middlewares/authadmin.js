import  Jwt  from "jsonwebtoken";

//admin authentication middleware

const authadmin = async (req,res,next)=>{
    try{
        const {atoken} =req.headers
        if(!atoken){
            return res.json({success:false,message:"Invalid Login Again"})
        }
        const token_decode = Jwt.verify(atoken,process.env.JWT_SECRET)
        
        // check whether the passowrd email is correct or not
        if(token_decode!== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Invalid Login Again"})
        }
        next()

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default authadmin