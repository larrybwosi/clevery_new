import React, { useState, useCallback, useEffect } from 'react';
import { Platform, FlatList, ListRenderItem, Pressable } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
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
  onSelect: (assets: (MediaLibrary.Asset | FileSystem.FileInfo)[]) => void;
  includeFiles?: boolean;
  maxSelection?: number;
  columns?: number;
}

type AssetType = MediaLibrary.Asset | FileSystem.FileInfo;

const ImagePicker: React.FC<ImagePickerProps> = ({
  onSelect,
  includeFiles = false,
  maxSelection = Infinity,
  columns = 3,
}) => {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        loadAssets();
      }
    })();
  }, []);

  const loadAssets = useCallback(async () => {
    const mediaAssets = await MediaLibrary.getAssetsAsync({
      mediaType: ['photo', 'video'],
      sortBy: ['creationTime'],
      first: 1000,
    });

    let allAssets = [...mediaAssets.assets];

    if (includeFiles && Platform.OS !== 'web') {
      const fileAssets = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory||"");
      const fileInfos = await Promise.all(
        fileAssets.map(file => FileSystem.getInfoAsync(FileSystem.documentDirectory + file))
      );
      allAssets = [...allAssets, ...fileInfos.filter(info => info.exists && !info.isDirectory)];
    }

    setAssets(allAssets);
  }, [includeFiles]);

  const toggleAssetSelection = useCallback((asset: AssetType) => {
    setSelectedAssets(prev => {
      const isSelected = prev.some(item => item.id === asset.id);
      if (isSelected) {
        return prev.filter(item => item.id !== asset.id);
      } else if (prev.length < maxSelection) {
        return [...prev, asset];
      }
      return prev;
    });
  }, [maxSelection]);

  const renderItem: ListRenderItem<AssetType> = useCallback(({ item, index }) => {
    const isSelected = selectedAssets.some(asset => asset.id === item.id);
    const isImage = 'uri' in item;

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <Pressable onPress={() => toggleAssetSelection(item)} flex={1} m={1}>
          <Box position="relative" borderRadius="md" overflow="hidden">
            {isImage ? (
              <Image
                source={{ uri: item.uri }}
                alt="Asset"
                size="full"
              />
            ) : (
              <Box bg="gray.200" justifyContent="center" alignItems="center">
                <Ionicons name="document" size="25" color="gray.500" />
              </Box>
            )}
            {isSelected && (
              <Box className='absolute top-0 right-0 p-1 bg-[rgba(0,0,0,0.5)]'>
                <Ionicons name="checkmark-circle" size="20" color="white" />
              </Box>
            )}
          </Box>
        </Pressable>
      </Animated.View>
    );
  }, [selectedAssets, toggleAssetSelection]);

  if (!hasPermission) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Permission to access media library is required.</Text>
      </Box>
    );
  }

  return (
    <VStack flex={1}>
      <HStack justifyContent="space-between" p={4} bg={colors.primary[500]}>
        <Text color="white" fontSize="lg" fontWeight="bold">
          Select Assets
        </Text>
        <Text color="white">
          {selectedAssets.length} / {maxSelection === Infinity ? '∞' : maxSelection}
        </Text>
      </HStack>
      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        contentContainerStyle={{ padding: 4 }}
      />
      <Box position="absolute" bottom={8} right={8}>
        <Pressable
          onPress={() => onSelect(selectedAssets)}
          bg={colors.primary[500]}
          p={4}
          borderRadius="full"
          shadow={2}
        >
          <Ionicons name="checkmark" size="xl" color="white" />
        </Pressable>
      </Box>
    </VStack>
  );
};

export default ImagePicker;