import { View } from "../Themed";
import Post from "../Home/Post";
import { FlatList } from "react-native";

const SearchResults = ({result, resultType }:{resultType:string,result:any}) => {
  
  if (resultType ==='media-links'){
    return (
      <View className="flex-1 justify-center items-center">
        <FlatList
          data={result}
          renderItem={({ item }: { item: any }) =><Post key={item._id} props={item} />}
          keyExtractor={(item: any) => item?._id} 
          onEndReachedThreshold={0.5}
        />
      </View>
    )
  }
};


export default SearchResults;
