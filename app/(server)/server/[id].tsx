import { useLocalSearchParams, usePathname } from 'expo-router';
import ServerComponent from '@/components/Servers/server';
import { memo } from 'react';

const Server = () => {
  const {id} = useLocalSearchParams()
  return <ServerComponent serverId={id as string} />
}

export default memo(Server)