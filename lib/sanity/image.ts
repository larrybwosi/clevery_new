import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId, token} from './env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId||'',
  dataset: dataset||'', 
})

export const urlForImage = (source:any) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}

async function uploadImage(file:string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/assets/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.document.asset._ref;
}
