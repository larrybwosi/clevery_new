import React from 'react'
import { Modal, Text, View } from 'native-base'
import MembersComponent from './Servers/members'

interface Props {
  label:string;
  images:string[];
}
export default function MembersList({label,images}:Props) {
  return (
    <Modal marginTop="10" >
      <Text>{label}</Text>
      <MembersComponent userImages={images}/>
    </Modal>
  )
}