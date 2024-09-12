import Globe from 'react-globe.gl'
import { useAppContext } from '../hooks/useAppContext'
import { Country, Point, CountryArtistData } from '../constants'

type ArtistsGlobeProps = {
    countries: Country[]
    targetCountryCenter: Point
    targetCountry: string
    targetCountryCount: number
    adjustGlobePointOfView: () => void
    canvasSize: number
    allCountriesArtistData: CountryArtistData[]
    topArtistsCountries: Set<string>
}

const ArtistsGlobe = ({countries, adjustGlobePointOfView, canvasSize, allCountriesArtistData, topArtistsCountries}: ArtistsGlobeProps) => {
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
                const countryCode = (c as Country).properties.ISO_A2
                return topArtistsCountries.has(countryCode) ? 'purple' : 'steelblue'
            }}
            polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
            polygonAltitude={() => 0.01}
            polygonStrokeColor={() => '#111'}
            labelsData={allCountriesArtistData}
            labelText={(c) => {
                const countValue = (c as CountryArtistData).count
                return `${countValue} ${countValue > 1 ? 'artists' : 'artist'}`
            }}
            labelAltitude={0.05}
            labelLat={(c) => (c as CountryArtistData).center.latitude}
            labelLng={(c) => (c as CountryArtistData).center.longitude}
            labelSize={2}
            onGlobeReady={handleGlobeReady}
        />
    )
}

export default ArtistsGlobe
