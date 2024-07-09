import React from 'react'
import { Modal, Text, View } from 'native-base'
import MembersComponent from './members'

export default function MembersList() {
  return (
    <Modal marginTop="10" >
      <Text>MembersLis</Text>
      <MembersComponent/>
    </Modal>
  )
}