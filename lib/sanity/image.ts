import createImageUrlBuilder from '@sanity/image-url'

import { endpoint, env } from "../env";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||'2023-09-25' || '2023-05-30'

 const dataset = env.sanityDataset;
 const projectId = env.sanityProjectId
 
const imageBuilder = createImageUrlBuilder({
  projectId: projectId||'',
  dataset: dataset||'', 
})

export const urlForImage = (source: string | any): any => {
  // Check if the source is a string (URL)
  if (typeof source === 'string') {
    // Check if it's a Sanity image URL
    const sanityImageRegex = /^image-([a-f\d]+)-\d+x\d+-\w+$/;
    const match = source.match(sanityImageRegex);

    if (match) {
      // Extract the ID from the URL
      const imageId = match[1];
      
      // Create a Sanity image object
      const sanityImage = {
        _type: 'image',
        asset: {
          _ref: `image-${imageId}`,
          _type: 'reference'
        }
      };

      // Return the optimized URL
      return imageBuilder.image(sanityImage).auto('format').fit('max').url();
    }
    
    // If it's not a Sanity image URL, return the original URL
    return source;
  }

  // If it's already a Sanity image object, process it
  return imageBuilder.image(source).auto('format').fit('max').url();
}

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
        'Content-Type': 'application/octet-stream'
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
