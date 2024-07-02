import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { Point } from '../constants'
import { useSpotify } from '../hooks/useSpotify'

type AppContext = {
    token: string
    setToken: React.Dispatch<React.SetStateAction<string>>
    analysisDone: boolean
    setAnalysisDone: React.Dispatch<React.SetStateAction<boolean>>
    globePOV: Point
    setGlobePOV: React.Dispatch<React.SetStateAction<Point>>
    userEmail: string
}

export const AppContext = createContext<AppContext>({} as AppContext)

export const AppContextProvider = ({children}: PropsWithChildren) => {
    const [token, setToken] = useState<string>('')
    const [analysisDone, setAnalysisDone] = useState<boolean>(false)
    const [globePOV, setGlobePOV] = useState<Point>({} as Point)
    const [userEmail, setUserEmail] = useState('')
    const { getUserEmail } = useSpotify()

    const fetchUserEmail = async (token: string) => {
        const email = await getUserEmail(token)
        // console.log('email', email)
        setUserEmail(email)
    }

    useEffect(() => {
        if (token) {
            fetchUserEmail(token)
        }
    }, [token])

    return <AppContext.Provider value={{
        token, setToken, userEmail,
        analysisDone, setAnalysisDone,
        globePOV, setGlobePOV
    }}>
        {children}
    </AppContext.Provider>
}