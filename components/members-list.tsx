import MembersComponent from './Servers/members'
import { Modal } from './ui/modal';
import { Text } from './Themed';

interface Props {
  label:string;
  images:string[];
}
export default function MembersList({label,images}:Props) {
  return (
    <Modal className='mt-10' >
      <Text>{label}</Text>
      <MembersComponent userImages={images}/>
    </Modal>
  )
}