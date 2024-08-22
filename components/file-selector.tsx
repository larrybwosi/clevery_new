import { useState, useCallback, useEffect } from 'react';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Box } from './ui/box';
import { VStack } from './ui/vstack';
import { Text } from './Themed';
import { HStack } from './ui/hstack';

interface ImagePickerProps {
  onSelect: (assets: FileSystem.FileInfo[]) => void;
  maxSelection?: number;
  columns?: number;
}

type AssetType = FileSystem.FileInfo;

const ImagePicker: React.FC<ImagePickerProps> = ({
  onSelect,
  maxSelection = Infinity,
  columns = 3,
}) => {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      await loadAssets();
    })();
  }, []);

  const loadAssets = useCallback(async () => {
    const fileAssets = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || "");
    const fileInfos = await Promise.all(
      fileAssets.map(file => FileSystem.getInfoAsync(FileSystem.documentDirectory + file))
    );
    const allAssets = fileInfos.filter(info => info.exists && !info.isDirectory);
    setAssets(allAssets);
  }, []);

  const toggleAssetSelection = useCallback((asset: AssetType) => {
    setSelectedAssets(prev => {
      const isSelected = prev.some(item => item.uri === asset.uri);
      if (isSelected) {
        return prev.filter(item => item.uri !== asset.uri);
      } else if (prev.length < maxSelection) {
        return [...prev, asset];
      }
      return prev;
    });
  }, [maxSelection]);

  const renderItem: ListRenderItem<AssetType> = useCallback(({ item, index }) => {
    const isSelected = selectedAssets.some(asset => asset.uri === item.uri);
    const isImage = item.uri.endsWith('.jpg') || item.uri.endsWith('.png');

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <Pressable onPress={() => toggleAssetSelection(item)} className='flex-1 m'>
          <Box className="w-full h-32 rounded-md overflow-hidden" >
            {isImage ? (
              <Image
                source={{ uri: item.uri }}
                className="w-full h-full"
                alt="Asset"
              />
            ) : (
              <Box className='bg-gray-200 justify-center items-center' >
                <Ionicons name="document" size={24} color="gray.500" />
              </Box>
            )}
            {isSelected && (
              <Box className='absolute top-0 right-0 p-1 bg-[rgba(0,0,0,0.5)]'>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </Box>
            )}
          </Box>
        </Pressable>
      </Animated.View>
    );
  }, [selectedAssets, toggleAssetSelection]);

  return (
    <VStack className="flex-1">
      <HStack className='justify-between p-4 bg-primary-500' >
        <Text className="font-rbold text-white text-lg" >
          Select Assets
        </Text>
        <Text className='text-white'>
          {selectedAssets.length} / {maxSelection === Infinity ? '∞' : maxSelection}
        </Text>
      </HStack>
      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        numColumns={columns}
        contentContainerStyle={{ padding: 4 }}
      />
      <Box className='absolute bottom-8 right-8' >
        <Pressable
          onPress={() => onSelect(selectedAssets)}
          className='p-4 rounded-full bg-primary-500 shadow-2'
        >
          <Ionicons name="checkmark" size={24} color="white" />
        </Pressable>
      </Box>
    </VStack>
  );
};

export default ImagePicker;