import {ObjectId} from "mongoose"

export const toObjectId = (str)=>{
    return  new ObjectId(str)
}