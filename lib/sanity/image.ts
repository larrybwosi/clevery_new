
import { endpoint, env } from "../env";

export async function uploadImage(file:string) {
  try {
    const res = await fetch(file);
    const blob = await res.blob();

    // const fs = fs
    var formData = new FormData();
    formData.append('file', blob );

    const response = await fetch(`${endpoint}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      }, 
      body: formData
    }).then((res)=>res).catch((err)=>console.log(err))
    const data = await response?.json();
    console.log(data)
    return data
  } catch (error:any) {
    console.log(error)
}
}


/**
 * Given an image URL, returns an optimized image URL
 */
export async function getOptimizedImageUrl(imageUrl: string) {
  const response = await fetch(`${endpoint}/optimize?url=${encodeURIComponent(imageUrl)}`);
  const { optimizedImage } = await response.json();
  return optimizedImage;
}
