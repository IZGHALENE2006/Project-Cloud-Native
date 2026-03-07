import UserModele from '../modeles/Admin.modele.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Login User

export const Login  =  async(req,res)=>{
    const {email,password} = req.body
    const checkUser = await  UserModele.findOne({email})



    if(!checkUser) return res.status(404).json({message:"Email ou mot de passe invalide"})
    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch)  return res.status(404).json({ message: "Email ou mot de passe invalide" });


    //Tokene
     const Token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      Token,
      user: {
        id: checkUser._id,
        name: checkUser.name,
        email: checkUser.email
    
    } })
}


//Get Me 
export const getMe = async (req, res) => {
  try {
    const user = await UserModele.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
