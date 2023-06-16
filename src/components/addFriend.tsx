import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input

export default function AddFriend() {

  const [value, setValue] = useState<string>('')

  const onSearch = () => {
  }

  return (
    <div style={{ textAlign: 'center', minHeight: '60px' }}>
      <Search placeholder="Input username or name" onSearch={onSearch} style={{ width: 300 }} />
    </div>
  )
}