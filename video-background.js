// Load the YouTube IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-background-video', {
        videoId: 'qlbyuqneD3o', // Your video ID
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'playlist': 'qlbyuqneD3o', // Required for looping
            'mute': 1, // Required for autoplay
            'playsinline': 1,
            'start': 404, // Start at 6:44
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    // Set quality to high definition if available
    player.setPlaybackQuality('hd1080');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo(); // Ensure continuous playback
    }
}

// Handle visibility change to prevent video stopping when switching tabs
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
});

// Ensure video plays on mobile devices
document.addEventListener('touchstart', function() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}, { once: true });