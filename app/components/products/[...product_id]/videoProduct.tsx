'use client'


export default function VideoProduct(videoProduct: VideoProduct){

    return (          
        <div className='w-1/2 h-full bg-gradient-to-b from-violet-200 to-violet-900'>
            {videoProduct.isVisible ? (
             <video controls preload="none" className="w-3/4 mx-auto my-44 h-80">
                <source src={videoProduct.video_url} type="video/mp4" />
                    <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                    />
                Your browser does not support the video tag.
            </video>
            ) : (
            <div className="w-3/4 mx-auto h-screen"></div>
            )}
        </div>      
    )
}