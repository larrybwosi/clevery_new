import { env } from "../env";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||'2023-09-25' || '2023-05-30'

export const dataset = env.sanityDataset;
export const projectId = env.sanityProjectId
export const token ='skvnw3I2ESwFWn6wPrPOxarSGbdpitgEcgDs0KC44Bmq7H713C8ix2XubQej6vJ8lnecCMktXgxMn4x2BNZ1sgT2YLWtu3Pu8vRbqwH0uaQPtbD4C1XTW1R9oURJgQmfMICesX1C14rkDcPd8BBp3ePSrbzB0MkWBianw94KIOuMqtQSXivG'
export const useCdn = false
 