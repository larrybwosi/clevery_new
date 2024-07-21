import { pusher } from "../pusher/config";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<any | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusher.subscribe({channelName: 'presence-messenger'});
      setActiveChannel(channel);
    }

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusher.unsubscribe({channelName: 'presence-messenger'});
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
