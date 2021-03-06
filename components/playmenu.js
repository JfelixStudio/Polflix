define(['actionsheet', 'datetime', 'playbackManager'], function (actionsheet, datetime, playbackManager) {

    function show(item) {

        var itemType = item.Type;
        var mediaType = item.MediaType;
        var isFolder = item.IsFolder;
        var itemId = item.Id;
        var resumePositionTicks = item.UserData ? item.UserData.PlaybackPositionTicks : null;

        if (!resumePositionTicks && mediaType != "Audio" && !isFolder) {
            playbackManager.play({
                items: [item]
            });
            return;
        }

        var menuItems = [];

        if (resumePositionTicks) {
            menuItems.push({
                name: Globalize.translate('core#ButtonResumeAt', datetime.getDisplayRunningTime(resumePositionTicks)),
                id: 'resume',
                ironIcon: 'play-arrow'
            });

            menuItems.push({
                name: Globalize.translate('core#ButtonPlayFromBeginning'),
                id: 'play',
                ironIcon: 'play-arrow'
            });
        } else {
            menuItems.push({
                name: Globalize.translate('core#ButtonPlay'),
                id: 'play',
                ironIcon: 'play-arrow'
            });
        }

        if (playbackManager.canQueueMediaType(mediaType)) {
            menuItems.push({
                name: Globalize.translate('core#ButtonQueue'),
                id: 'queue',
                ironIcon: 'playlist-add'
            });
        }

        if (itemType == "Audio" || itemType == "MusicAlbum" || itemType == "MusicArtist" || itemType == "MusicGenre") {
            menuItems.push({
                name: Globalize.translate('core#ButtonInstantMix'),
                id: 'instantmix',
                ironIcon: 'shuffle'
            });
        }

        if (isFolder || itemType == "MusicArtist" || itemType == "MusicGenre") {
            menuItems.push({
                name: Globalize.translate('core#ButtonShuffle'),
                id: 'shuffle',
                ironIcon: 'shuffle'
            });
        }

        actionsheet.show({
            items: menuItems,
            callback: function (id) {

                switch (id) {

                    case 'play':
                        playbackManager.play(itemId);
                        break;
                    case 'resume':
                        playbackManager.play({
                            ids: [itemId],
                            startPositionTicks: resumePositionTicks
                        });
                        break;
                    case 'queue':
                        playbackManager.queue(itemId);
                        break;
                    case 'instantmix':
                        playbackManager.instantMix(itemId);
                        break;
                    case 'shuffle':
                        playbackManager.shuffle(itemId);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    return {
        show: show
    };
});