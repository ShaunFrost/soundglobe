import landing_image from '../assets/bg-image.png'
import spotify_logo from '../assets/Spotify_Primary_Logo_RGB_Green.png'
const Landing = () => {
    const handleSpotifyAuth = () => {
        const spotifyAuthUrl = import.meta.env.VITE_SPOTIFY_AUTH_URL
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
        const redirectUri = import.meta.env.VITE_RIDIRECT_URI
        const scopes = ["user-read-recently-played", "user-library-read", "user-top-read"]
        window.location.href = `${spotifyAuthUrl}?client_id=${clientId}&response_type=token&scope=${scopes.join(" ")}&redirect_uri=${redirectUri}`
    }
    return (
        <div className="h-screen w-screen flex flex-col-reverse sm:flex-row sm:gap-32 justify-center items-center bg-black">
            <div className="flex flex-col justify-center items-center">
                <div className="max-w-[350px] text-white text-4xl text-center mb-4">
                    Which country's artists do you listen to the most?
                </div>
                <div className="max-w-[350px] text-white text-center mb-12">
                    Sync your Spotify and get a map of where the artists you're into are from!
                </div>
                <div className="flex flex-row gap-[10px] items-center px-4 py-2 rounded-full bg-[#f5f5f5] hover:cursor-pointer" onClick={handleSpotifyAuth}>
                    <img src={spotify_logo} height={'50px'} width={'50px'}/>
                    <span className="text-black font-bold">Connect Spotify</span>
                </div>
            </div>
            <div>
                <img src={landing_image} />
            </div>
        </div>
    )
}

export default Landing