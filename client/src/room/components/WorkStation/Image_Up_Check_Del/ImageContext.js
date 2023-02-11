import React, { useState } from "react";
import { createContext } from "react";

const ImageContext = createContext({
    url:"",
    sendurl: (url) => {}
})

export const TocanvasProvider = (props) => {
    const [url, seturl] = useState("")

    const sendurl = (url) => {
        seturl(url)
    }

    const imagetocanvas = {
        url:url,
        sendurl:sendurl
    }
    return(
        <ImageContext.Provider value={imagetocanvas}>
            {props.children}
        </ImageContext.Provider>
    )
}
export default ImageContext