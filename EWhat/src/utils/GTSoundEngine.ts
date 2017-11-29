// TypeScript file
/**
 * asSimpleSoundEngine
 */

class GTSoundEngine {
    static instance:GTSoundEngine = null;

    soundVolumn:number = 100;
    musicVolumn:number = 100;

    soundStatus:boolean = true;
    musicStatus:boolean = true;

    currentMusicChannel:egret.SoundChannel = null;

    static getInstance():GTSoundEngine {
        if (GTSoundEngine.instance == null) {
            GTSoundEngine.instance = new GTSoundEngine();
        }
        return GTSoundEngine.instance;
    }

    constructor() {
        this.init();
    }

    private init(): void{
        let value:number = GTLocalStorage.getInstance().getKeyInt("sound");
        if (isNaN(value) || value == 1) {
            this.soundStatus = true;
        } else {
            this.soundStatus = false;
        }

        value = GTLocalStorage.getInstance().getKeyInt("music");
        if (isNaN(value) || value == 1) {
            this.musicStatus = true;
        } else {
            this.musicStatus = false;
        }

        value = GTLocalStorage.getInstance().getKeyInt("sound_volumn");
        if (isNaN(value)) {
            this.soundVolumn = 100;
        } else {
            this.soundVolumn = value;
        }

        value = GTLocalStorage.getInstance().getKeyInt("music_volumn");
        if (isNaN(value)) {
            this.musicVolumn = 100;
        } else {
            this.musicVolumn = value;
        }
    }

    public playSound(soundName:string):void {

        RES.getResAsync(soundName, function(result:Array<any>) {
                if (this.soundStatus) {
                    var sound:egret.Sound = RES.getRes(soundName);
                    sound.play(0,1);
                }
            }, this);
            
    }

    public playMusic(musicName:string):void {

        RES.getResAsync(musicName, function(result:Array<any>) {
                if (this.musicStatus) {
                    var channel:egret.SoundChannel = this.currentMusicChannel;
                    if (channel) {
                        channel.stop();
                        this.currentMusicChannel = null;
                    }
                    var music:egret.Sound = RES.getRes(musicName);
                    if (music) {
                        this.currentMusicChannel = music.play(0,0);
                    } else {
                        egret.error("asSoundEngine.playerMusic file not found!");
                    }
                    
                }
            }, this);
    }

    public stopSound(): void {
        //todo
        egret.error("asSoundEngine:stopSound is not implemented!");
    }

    public stopMusic(): void {
        //todo
        if (this.currentMusicChannel) {
            this.currentMusicChannel.stop();
            this.currentMusicChannel = null;
        }
    }

    public getMusicLocalStorage(): number {
        let value:number = GTLocalStorage.getInstance().getKeyInt("music");
        if (isNaN(value)) {
             value = GTLocalStorage.getInstance().getKeyInt("music");
        }
        return value ;
    }
    
    public getSoundsLocalStorage(): number {
        let value:number = GTLocalStorage.getInstance().getKeyInt("sound");
        if (isNaN(value)) {
             GTLocalStorage.getInstance().setKeyNumber("sound" , 1);
             value = GTLocalStorage.getInstance().getKeyInt("sound");
        }
        return value ;
    }

    public setMusicLocalStorage(value: number ): void {
        GTLocalStorage.getInstance().setKeyNumber("music" , value);
    } 

    public setSoundsLocalStorage(value: number ): void {
        GTLocalStorage.getInstance().setKeyNumber("sound" , value);
    } 

//??? realy need this??
    public resumeSound(): void {

    }
//??? realy need this??
    public resumeMusic(): void {

    }

    public setBackgroundRun(isInBackground:boolean):void {
        if(isInBackground) {
		    GTSoundEngine.getInstance().musicStatus = false ; 
            GTSoundEngine.getInstance().soundStatus = false; 
            GTSoundEngine.getInstance().stopMusic();
            GTSoundEngine.getInstance().stopSound();
        } else {
            GTSoundEngine.getInstance().musicStatus = GTSoundEngine.getInstance().getMusicLocalStorage() == 1 ? true : false;
            GTSoundEngine.getInstance().soundStatus = GTSoundEngine.getInstance().getSoundsLocalStorage()== 1 ? true : false;
            // if (GTSoundEngine.getInstance().musicStatus) {
            //     if (GameMainScene.GetInstance().currentScene() == GameSceneType.GAME_SCENE_MAP) {
            //         GameSoundsHelper.HandleSpecail(GameSoundSpecial.bg_battle);
            //     }
            //     else {
            //         GameSoundsHelper.HandleSpecail(GameSoundSpecial.bg_normal);
            //     }
            // }
        }
    }
}