import axios from "axios";
import { endpoint } from "../env";
import { client } from "../sanity/client";

export  const uploadImage = async (imageUrl:string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const result = (await axios.post(`${endpoint}/uploadthing`,blob)).data
    console.log(result)
    return result?.imageId;
  } catch (error:any) {
    console.error('Error uploading image:', error.message);
    throw error
  }
  };

export const uploadImages = async (files: string[]):Promise<any> => {
  try {
    const imageAssets = await Promise.all(
      files.map(async (image: any) => {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        
        const result = (await axios.post(`${endpoint}/uploadthing`,blob)).data
        return result?.imageId;
      })
    );
    return imageAssets;
  } catch (error) {
    console.log(error)
    throw error
  }
};
  
export  async function getBannerImages() {
  try {
    const response = await axios.get(`${endpoint}/bannerImages`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}


export const deleteAssets = async ({imageIds,postId}:{imageIds:string[],postId:string})=> {
  try {
    const response =await axios.post(`${endpoint}/deleteimages?id=${postId}`,imageIds) 
    return response.data
  } catch (error) {
    console.error(error);
    return false;
  }
}