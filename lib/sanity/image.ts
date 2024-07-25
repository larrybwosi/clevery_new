import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId, token} from './env'
import { dataTagSymbol } from '@tanstack/react-query'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId||'',
  dataset: dataset||'', 
})

export const urlForImage = (source:any) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}

export async function uploadImage(file:string) {
  try {
    const res = await fetch(file);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('file', blob);

    const response = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream'
      }, 
      body: blob
    });
    const data = await response.json();
    return {
      _id:data.document._id,
      url:data.document.url
    } 
  } catch (error:any) {
    console.log(error)
}
}

export async function uploadImageToSanity(imageString: string): Promise<string> {
  // Create a blob from the image string
  const blob = await fetch(imageString)
   .then(response => response.blob())
   .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));

  // Upload the blob to Sanity using fetch
  const response = await fetch(`https://mqczcmfz.api.sanity.io/producion/assets/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_SANITY_TOKEN}`,
      'Content-Type': 'application/octet-stream'
    }, 
    body: blob
  });
console.log(response.json())
  // Get the document _id from the response
  const { _id } = await response.json();

  return _id;
}