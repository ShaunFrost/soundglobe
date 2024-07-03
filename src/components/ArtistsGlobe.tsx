import Globe from 'react-globe.gl'
import { useAppContext } from '../hooks/useAppContext'
import { Country, Point } from '../constants'

type ArtistsGlobeProps = {
    countries: Country[]
    targetCountryCenter: Point
    targetCountry: string
    targetCountryCount: number
    adjustGlobePointOfView: () => void
    canvasSize: number
}

const ArtistsGlobe = ({countries, targetCountryCenter, targetCountry, targetCountryCount, adjustGlobePointOfView, canvasSize}: ArtistsGlobeProps) => {
    const { appGlobeRef } = useAppContext()
    
    const handleGlobeReady = () => {
        adjustGlobePointOfView()
    }
    
    return (
        <Globe 
            ref={appGlobeRef}
            width={canvasSize}
            height={canvasSize}
            rendererConfig={{preserveDrawingBuffer: true}}
            // globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            lineHoverPrecision={0}
            polygonsData={countries}
            polygonCapColor={(c) => {
                return (c as Country).properties.ISO_A2 !== targetCountry ? 'steelblue' : 'purple'
            }}
            polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
            polygonAltitude={() => 0.01}
            polygonStrokeColor={() => '#111'}
            labelsData={[targetCountryCenter]}
            labelText={() => `${targetCountryCount} artists`}
            labelAltitude={0.05}
            labelLat={(c) => (c as Point).latitude}
            labelLng={(c) => (c as Point).longitude}
            labelSize={2}
            onGlobeReady={handleGlobeReady}
        />
    )
}

export default ArtistsGlobe
