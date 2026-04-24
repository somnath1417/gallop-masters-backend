const router=require('express').Router();const auth=require('../../middlewares/auth');const asyncHandler=require('../../utils/asyncHandler');const service=require('./wallet.service');
router.use(auth);
router.get('/balance',asyncHandler(async(req,res)=>res.json({success:true,data:await service.myBalance(req.user)})));
router.post('/allocate',asyncHandler(async(req,res)=>res.json({success:true,data:await service.allocateCoins(req.user,req.body)})));
router.get('/transactions',asyncHandler(async(req,res)=>res.json({success:true,data:await service.transactions(req.user,req.query.user_id)})));
module.exports=router;
