import React, { useState } from "react";
import { createContext } from "react";
import axios from "axios"

const ImageContext = createContext({
    url:"",
    width:0,
    heigth:0,
    type:'',
    sendurl: (url) => {}
})

export const TocanvasProvider = (props) => {
    const [url, seturl] = useState("")
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [type, settype] = useState("")

    const sendurl = (url) => {
        axios.post("http://localhost:5000/canvas/imageinfo",{url:url}).then(async (res) => {
            setWidth(res.data.width)
            setHeight(res.data.height)
            settype(res.data.type)
            seturl(url)
        })
    }



    const imagetocanvas = {
        url:url,
        width:width,
        height:height,
        type:type,
        sendurl:sendurl
    }
    return(
        <ImageContext.Provider value={imagetocanvas}>
            {props.children}
        </ImageContext.Provider>
    )
}
export default ImageContext