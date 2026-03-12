import carModele from '../modeles/car.modele.js'

//Add New Cars
export const AddCars = async(req,res)=>{

    const {brand,model,registrationNumber,color,pricePerDay,status,year} = req.body
    const imageName = req.file ? req.file.filename : null

         if (!brand || !model || !registrationNumber || !color || !pricePerDay || !status || !year) {
    return res.status(400).json({
        message: "All fields are required"
    })}
    const Car = {
        AdminId:req.user.id,
        image:imageName,
        brand,
        model,
        registrationNumber,
        color,
        pricePerDay,
        status,
        year
    }
try{
        const NewCategory = await carModele.create(Car)
    res.status(201).json(NewCategory)
}catch(err){
    console.log(err)
    res.status(500).json({message:err.message})
}
}   
//All Cars by User
export const GetCar = async(req,res)=>{
    const Cars = await carModele.find({AdminId:req.user.id})
    res.json(Cars)
}


 //delete Car

 export const DeleteCar  = async(req,res)=>{
    const {id} = req.params
    const DeleteItem = await carModele.findByIdAndDelete(id)
  if(!DeleteItem) return res.status(404).json({message:"Not Found"})
    res.status(201).json(DeleteItem)

 }

    // Update Car

export const UpdateCar = async (req, res) => {
  const { id } = req.params;
  const { brand, model, registrationNumber, color, pricePerDay, status, year } = req.body;
    const imageName = req.file ? req.file.filename : null

  // التحقق من جميع الحقول المطلوبة
  if (!brand || !model || !registrationNumber || !color || !pricePerDay || !status || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // بناء object ديال التحديث
  const CarUpdate = {
    AdminId: req.user.id,
    brand,
    model,
    image:imageName,
    registrationNumber,
    color,
    pricePerDay,
    status,
    year,
  };

  // إذا جا الملف (صورة) ضيفو
  if (req.file) {
    CarUpdate.image = req.file.filename;
  }

  try {
    const updatedCar = await carModele.findByIdAndUpdate(id, CarUpdate, { new: true });

    if (!updatedCar) return res.status(404).json({ message: "Car not found" });

    res.status(200).json(updatedCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};