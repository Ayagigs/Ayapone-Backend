import mongoose from "mongoose"

export const toObjectId = (str)=>{
    const id =  new mongoose.Types.ObjectId(str)
    console.log(id+"  ->id");
    return id
}