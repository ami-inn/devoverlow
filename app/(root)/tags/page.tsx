import { getTags } from '@/lib/actions/tag.action'
import React from 'react'

const page =async () => {
  const{success,data,error} = await getTags({
    page:1,
    pageSize:10,
    // query:'test',
  })

  const {tags} = data || {}
  console.log("tags in tag page:",JSON.stringify(tags,null,2));
  return ( 
    <div>
      
    </div>
  )
}

export default page
