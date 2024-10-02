import React, { useEffect } from 'react'
import { addMediumBookmarkIcon } from '../../utils/mediumSelector.js'

function iconSelector(){
    const site = window.location.href;
    if(site.includes("medium.com")){
        addMediumBookmarkIcon();
    }
}


function SiteSaveIcons() {
useEffect(()=>{
    iconSelector();
},[]);
  return (
    <div></div>
  )
}

export default SiteSaveIcons