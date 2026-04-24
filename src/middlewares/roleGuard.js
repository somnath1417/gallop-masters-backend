module.exports=(roles=[])=>(req,res,next)=>roles.includes(req.user.role_key)?next():res.status(403).json({success:false,message:'Access denied'});
