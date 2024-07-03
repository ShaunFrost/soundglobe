import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Point } from '../constants'
import { useSpotify } from '../hooks/useSpotify'
import {GlobeMethods} from 'react-globe.gl'

type AppContext = {
    token: string
    setToken: React.Dispatch<React.SetStateAction<string>>
    globePOV: Point
    setGlobePOV: React.Dispatch<React.SetStateAction<Point>>
    userEmail: string
    appGlobeRef: React.MutableRefObject<GlobeMethods | undefined>
}

export const AppContext = createContext<AppContext>({} as AppContext)

export const AppContextProvider = ({children}: PropsWithChildren) => {
    const [token, setToken] = useState<string>('')
    const [globePOV, setGlobePOV] = useState<Point>({} as Point)
    const [userEmail, setUserEmail] = useState('')
    const { getUserEmail } = useSpotify()
    const appGlobeRef = useRef<GlobeMethods>()

    useEffect(() => {
        if (token) {
            const fetchUserEmail = async (token: string) => {
                const email = await getUserEmail(token)
                // console.log('email', email)
                setUserEmail(email)
            }

            fetchUserEmail(token)
        }
    }, [token, getUserEmail])

    return <AppContext.Provider value={{
        token, setToken, userEmail,
        globePOV, setGlobePOV, appGlobeRef
    }}>
        {children}
    </AppContext.Provider>
}