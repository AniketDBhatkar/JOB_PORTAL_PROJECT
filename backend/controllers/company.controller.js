import Company from "../models/company.model.js"

export const registerCompany=async(req,res)=>{
    try{
     const {companyName}= req.body;
     if(!companyName){
        return res.status(400).json({
            message:"Company Name is required",
            success:false
        })
     }
     let company=await Company.findOne({name:companyName})

     if(company){
        return res.status(400).json({
            message:"you cant register same company",
            success:false

        })
     }

     company=await Company.create({
        name:companyName,
        success:true
     });

     return res.status(201).json({
        message:"Company register Sucessfully",
        company,
        success:true
     })

    }catch(error){
        console.log(error);
    }
}

export const getCompany=async(req,res)=>{
    try{
      const userId=req.id;
      const companies=await Company.find({userId});

      if(!companies){
        return res.status(404).json({
            message:"Companies not Found",
            sucess:flase
        })
      }
    }catch(error){
        console.log(error)
    }
}