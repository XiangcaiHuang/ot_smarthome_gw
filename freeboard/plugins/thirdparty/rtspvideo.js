(function(){
	var VIDEO_ID = 0;
	var RtspWidget = function(settings){
		var self = this ;
		var RtspElement = $('<div id="dynamicallyPlayers" ></div>');
		var currentSettings = settings;
		var playerId = 'vxg_media_player';


		function createplayer(rtspUrl){
			var calculatedId = playerId + VIDEO_ID++;
			var div = document.createElement('div');
			div.setAttribute("id", calculatedId);
			div.setAttribute("class", "vxgplayer");
			var runtimePlayers = document.getElementById('dynamicallyPlayers');
			runtimePlayers.appendChild(div);
		    vxgplayer(calculatedId, {
		        url: rtspUrl,
		        nmf_path: 'media_player.nmf',
		        nmf_src: 'plugins/thirdparty/rtsp/js/vxgplayer-1.8.31/pnacl/Release/media_player.nmf',
		        latency: 300000,
		        aspect_ratio_mode: 1,
		        autohide: 3,
		        controls: true,
		        connection_timeout: 5000,
		        connection_udp: 0,
		        custom_digital_zoom: false
		    }).ready(function () {
		        console.log(' =>ready player ' + calculatedId);
		        player = vxgplayer;
		        vxgplayer(calculatedId).src(rtspUrl);
		        vxgplayer(calculatedId).play();
		        console.log(' <=ready player ' + calculatedId);
		    });

		}
		this.render = function (element) {
	        $(element).append(RtspElement);
	        createplayer(currentSettings.url);
	    }
	    this.onSettingsChanged = function (newSettings) {
	        currentSettings = newSettings;
	    }
	    this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "url") {
                currentSettings.url = newValue;
                createplayer(currentSettings.url);
            }
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return Number(currentSettings.height);
        }

        this.onSettingsChanged(settings);
	};


	freeboard.loadWidgetPlugin({
		"type_name": "rtspvideo",
		"display_name": "RTSPVideo",
		"fill_size":true,
		"external_scripts": [
			"plugins/thirdparty/rtsp/js/vxgplayer-1.8.31/vxgplayer-1.8.31.min.js"
		],
		"settings":[{
				"name": 'url',
				"display_name": 'URL',
				"type":"calculated ",
				"default_value":"rtsp://184.72.239.149/vod/mp4://BigBuckBunny_175k.mov",
				"description": "the video url"
			},
			{
                "name": "height",
                "display_name": "Height Blocks",
                "type": "number",
                "default_value": 4,
                "description": "A height block is around 60 pixels"
            }
		],
		
		newInstance: function(settings,newInstanceCallback){
			newInstanceCallback(new RtspWidget(settings));
		}
	});
}());