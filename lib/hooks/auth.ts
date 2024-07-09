import  *as Google  from 'expo-auth-session/providers/google'
import  *as Facebook  from 'expo-auth-session/providers/facebook'
import { endpoint, env } from '../env';
import { useAuthRequest,useAutoDiscovery } from 'expo-auth-session';

export const authHooks = () => {
  
const discovery = useAutoDiscovery("https://clevery.vercel.app/api/auth/signin")
  const [googleReq, googleRes, googleAsync] = Google.useAuthRequest({
    androidClientId: env.androidClient,
    iosClientId: env.iosClient,
    clientId:env.expoClientId,
    scopes: ['profile', 'email','phone'],
    })
    const [facebookReq, facebookRes, facebookAsync] = Facebook.useAuthRequest({
    androidClientId: '419395183801398',
    scopes: ['profile', 'email'],
    });
    if(!discovery) return
    const [gitReq, gitRes, gitAsync] = useAuthRequest({clientId:env.expoClientId!,redirectUri:"/"},{
      authorizationEndpoint:"https://clevery.vercel.app/api/auth/signin",
      userInfoEndpoint:`${endpoint}/profile`,
    });

    async function handleResponse() {
      if (googleRes?.type === 'success') {
          const { id_token } = googleRes.params;
          console.log(googleRes)
      }
      if (facebookRes?.type === 'success') {
        
      } 
        if (gitRes?.type === "success") {
          
        }
      }

    return{
        googleReq,googleRes, googleAsync,facebookReq, facebookRes, facebookAsync,gitReq, gitRes, gitAsync,handleResponse
    }
}

