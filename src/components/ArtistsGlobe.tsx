import React,{ forwardRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { useAppContext } from '../hooks/useAppContext'
import { Country, Point, TargetCountryData } from '../constants'

type ArtistsGlobeProps = {
    countries: Country[]
    mostArtistsCountry: Point[]
    targetCountryData: TargetCountryData
    handleAnalysisDone: () => void
    canvasSize: number
}

const ArtistsGlobe = forwardRef(function ArtistsGlobe({countries, mostArtistsCountry, targetCountryData, handleAnalysisDone, canvasSize}: ArtistsGlobeProps, globeRef: React.ForwardedRef<GlobeMethods>){
    const { setAnalysisDone } = useAppContext()
    
    const handleGlobeReady = () => {
        handleAnalysisDone()
        setAnalysisDone(true)
    }
    // useEffect(() => {
    //     console.log('Here in Artists Globe', countries, mostArtistsCountry)
    // }, [countries, mostArtistsCountry])
    
    return (
        <Globe 
            ref={globeRef}
            width={canvasSize}
            height={canvasSize}
            rendererConfig={{preserveDrawingBuffer: true}}
            // globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            lineHoverPrecision={0}
            polygonsData={countries}
            polygonCapColor={(c) => {
                return (c as Country).properties.ISO_A2 !== targetCountryData.country ? 'steelblue' : 'purple'
            }}
            polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
            polygonAltitude={() => 0.01}
            polygonStrokeColor={() => '#111'}
            labelsData={mostArtistsCountry}
            labelText={() => `${targetCountryData.count} artists`}
            labelAltitude={0.05}
            labelLat={(c) => (c as Point).latitude}
            labelLng={(c) => (c as Point).longitude}
            labelSize={2}
            onGlobeReady={handleGlobeReady}
        />
    )
}
)

export default ArtistsGlobe
