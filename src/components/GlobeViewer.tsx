import ArtistsGlobe from './ArtistsGlobe'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSoundglobeBackend } from '../hooks/useSoundglobeBackend'
import { Country, Point } from '../constants'
import { useAppContext } from '../hooks/useAppContext'

type GlobeViewerProps = {
    countries: Country[]
    targetCountryCenter: Point
    targetCountry: string
    targetCountryCount: number
}

const GlobeViewer = ({countries, targetCountryCenter, targetCountry, targetCountryCount}: GlobeViewerProps) => {

    const globeDivRef = useRef<HTMLDivElement>(null)
    const [canvasSize, setCanvasSize] = useState(window.innerWidth > 500 ? 500 : window.innerWidth)
    const [shareableLink, setShareableLink] = useState('')
    const { addImage } = useSoundglobeBackend()
    const { globePOV, userEmail, appGlobeRef } = useAppContext()
    const [isCreatingLink, setIsCreatingLink] = useState(false)

    const adjustGlobePointOfView = useCallback(() => {
        if (!appGlobeRef.current) return
        // console.log('POV', globePOV)
        if (globePOV && globePOV.latitude){
            appGlobeRef.current.pointOfView({
                lng: globePOV.longitude,
                lat: globePOV.latitude
            })
        }
    }, [globePOV, appGlobeRef]);

    const openTwitterToPost = (url: string) => {
        window.open(`https://twitter.com/intent/tweet?url=${url}`)
    }

    const writeImage = async (email: string, imageData: string) => {
        const { success, id } = await addImage(email, imageData)
        if (success) {
            const url = import.meta.env.VITE_BACKEND_URL + "/image/" + id
            setShareableLink(url)
            openTwitterToPost(url)
        }
    }

    const handleShare = () => {
        if (!appGlobeRef.current) return
        if (shareableLink) {
            openTwitterToPost(shareableLink)
            return
        }
        setIsCreatingLink(true)
        const renderer = appGlobeRef.current.renderer()
        const imageDataFromGlobe: string = renderer.domElement.toDataURL('image/jpeg', 0.5)

        writeImage(userEmail, imageDataFromGlobe).finally(() => setIsCreatingLink(false))
    }

    useEffect(() => {
        const handleResize = () => {
            const width = globeDivRef.current?.offsetWidth || 400
            if (width < 500) {
                setCanvasSize(width)
            } else {
                setCanvasSize(500)
            }
        };
    
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
        
    }, []);

    useEffect(() => {
        if (globePOV && globePOV.latitude) {
            adjustGlobePointOfView()
            // console.log('globePOV change useEffect')
        }
    }, [globePOV, adjustGlobePointOfView])

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-black gap-8">
            <div className="text-white text-2xl font-bold">
                Your music map
            </div>
            <div className="w-full aspect-square sm:max-w-[500px] bg-black" ref={globeDivRef}>
                <ArtistsGlobe countries={countries} targetCountryCenter={targetCountryCenter} 
                    targetCountry={targetCountry} targetCountryCount={targetCountryCount} 
                    adjustGlobePointOfView={adjustGlobePointOfView} canvasSize={canvasSize}
                />
            </div>
            <div className={`bg-black text-white px-8 py-2 rounded-full border-2 border-white font-bold hover:cursor-pointer ${isCreatingLink ? 'opacity-70' : ''}`} onClick={handleShare}>
                {isCreatingLink ? 'Creating link...' : 'Share with friends'}
            </div>
            {shareableLink}
        </div>
    )
}

export default GlobeViewer