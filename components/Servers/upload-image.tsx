import { TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Feather } from '@expo/vector-icons'
import { Text, View } from '../Themed'

const UploadImage = ({image,chooseImage,removeImage}:{image:string,chooseImage:()=>void,removeImage:any}) => {
  console.log(image)
  return (
    <View>
      {image ? (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: image }}
          />
          <TouchableOpacity onPress={()=>removeImage()} style={styles.closeIcon} >
            <Text className='font-rmedium text-xs' >Remove Image</Text>
          </TouchableOpacity>
        </View>
      ):
      <TouchableOpacity onPress={()=>chooseImage()} style={styles.uploadContainer}>
        <Feather name='camera' size={34} color={'gray'}/>
        <Feather name='plus' size={18} style={styles.plusIcon} />
        <Text style={styles.uploadText} >upload</Text>
      </TouchableOpacity>
      }
    </View>
  )
}

const styles =StyleSheet.create({
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    bottom: 0,
    right: '5%',
    padding:2,
    borderRadius:5,
  },
  uploadContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft:'30%',
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:15,
    marginVertical:30,
  },
  plusIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor:'#794D81',
    padding:2,
    color:'white',
    borderRadius:20,
  },
  uploadText: {
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },

})
export default UploadImage