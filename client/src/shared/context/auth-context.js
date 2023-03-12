import { createContext, useState } from "react";

export const AuthContext = createContext({
    rooomId:"",
    changeid: () => {}
});

const AuthContextProvider = (props) => {
    const [id, setid] = useState('')

    const changeid = (roomid) => {
        setid(roomid)
    }

    const context = {
        rooomId:id,
        changeid:changeid
    }

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
