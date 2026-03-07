import AdminModele from "../modeles/Admin.modele.js";
import bcrypt from "bcrypt"

//Add New Admin // Agency

export const AddnewAdmin = async(req,res)=>{
 try{
        const {agencyName,managerName,email,phoneNumber,address,city,password} = req.body
      if (!agencyName || !managerName || !email || !phoneNumber || !address || !city || !password) {
    return res.status(400).json({
        message: "All fields are required"
    })}
    const existEmail = await AdminModele.findOne({ email });

if (existEmail) {
 return res.status(400).json({ message: "Email already exists" });
}
    const Hashpass = await bcrypt.hash(password,10)
    const newobject = {
        agencyName,
        managerName,
        email,
        phoneNumber,
        address,
        city,
        password:Hashpass
    }
    const newAdmin = await AdminModele.create(newobject)
    if(!newAdmin) return res.status(404).json({message:"Not Found User"})
     res.status(201).json(newAdmin)   
 }catch(error){
    res.status(500).json(error.message)
 }
}