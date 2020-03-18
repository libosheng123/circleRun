const music_close_key = "music_close_key";
const sound_close_key = "sound_close_key";

// 声音类型
const AudioType = cc.Enum({
    AudioType_Effect: "Effect", // 音效，只播放一次
    AudioType_Music: "Music" // 音乐，循环播放
});

// 声音资源
const soundTypes = {
    enemy_bianfu_dead: 'enemy_bianfu_dead',
    enemy_bianfu_hit: 'enemy_bianfu_hit',
    enemy_langren_dead: 'enemy_langren_dead',
    enemy_langren_hit: 'enemy_langren_hit',
    enemy_yezhu_dead: 'enemy_yezhu_dead',
    enemy_yezhu_hit: 'enemy_yezhu_hit',
    game_background: 'game_background',
    game_start: 'game_start',
    renshen_fali1: 'renshen_fali1',
    renshen_fali2: 'renshen_fali2',
    renshen_fali3: 'renshen_fali3',
    renshen_fali4: 'renshen_fali4',
    texiao_bing1: 'texiao_bing1',
    texiao_bing2: 'texiao_bing2',
    texiao_huo1: 'texiao_huo1',
    texiao_huo2: 'texiao_huo2',
    wall_hit: 'wall_hit',
    weapon1: 'weapon1',
    weapon2: 'weapon2',
    weapon3: 'weapon3'
};

var AudioUtil = cc.Class({
    properties: {},
    ctor() {
        this.init();
    },
    init() {
        // 检查音乐开关
        this.checkMusicOpen();
        // 检查音效开关
        this.checkSoundOpen();
    },
    // 检查音乐开关
    checkMusicOpen() {
        StorageUtil.getLocalData(music_close_key).then((data) => {
            if (data.isMusicClosed) {
                this.musicOpen = false;
            } else {
                this.musicOpen = true;
            }
        }).catch(() => {
            this.musicOpen = true;
        });
    },
    // 检查音效开关
    checkSoundOpen() {
        StorageUtil.getLocalData(sound_close_key).then((data) => {
            if (data.isSoundClosed) {
                this.soundOpen = false;
            } else {
                this.soundOpen = true;
            }
        }).catch(() => {
            this.soundOpen = true;
        });
    },
    // 修改音乐状态
    changeMusicState() {
        this.musicOpen = !this.musicOpen;
        console.log('音乐开关 ' + this.musicOpen);
        if (this.musicOpen) {
            StorageUtil.saveLocalData(music_close_key, { isMusicClosed: false });
        } else {
            StorageUtil.saveLocalData(music_close_key, { isMusicClosed: true });
        }
        if (this.musicOpen) {
            // this.playBGAudio();
        } else {
            // this.stopBGAudio();
        }
    },
    // 修改音效状态
    changeSoundState() {
        this.soundOpen = !this.soundOpen;
        console.log('音效开关 ' + this.soundOpen);
        if (this.soundOpen) {
            StorageUtil.saveLocalData(sound_close_key, { isSoundClosed: false });
        } else {
            StorageUtil.saveLocalData(sound_close_key, { isSoundClosed: true });
        }
    },
    // 加载音频资源
    loadAudio(name) {
        return new Promise((resolve, reject) => {
            if (this[name + "IsLoading"]) {
                reject();
            } else if (this[name + "Audio"]) {
                resolve(this[name + "Audio"]);
            } else {
                this[name + "IsLoading"] = true;
                cc.log('load audio:' + name);
                // 加载资源
                cc.loader.loadRes(
                    "subpackage/audios/" + name,
                    cc.AudioClip,
                    (err, audioClip) => {
                        this[name + "IsLoading"] = false;
                        if (err) {
                            reject();
                        } else {
                            this[name + "Audio"] = audioClip;
                            resolve(this[name + "Audio"]);
                        }
                    }
                );
            }
        });
    },
    /**
     * 播放音频
     * @param {soundTypes} soundType 音频资源
     * @param {AudioType} audioType 播放类型
     */
    playAudio(soundType, audioType) {
        // console.log('playAudio:'+ soundType + " type:" + audioType);
        // 音效
        if (audioType == AudioType.AudioType_Effect && this.soundOpen) {
            // let time = new Date().getTime();
            // 小于50ms间隔，不予播放
            // if (this.lastEffectTime && time - this.lastEffectTime < 50) {
            //   return;
            // }
            // this.lastEffectTime = time;
            if (this[soundType + "Audio"]) {
                // 播放已加载音效
                cc.audioEngine.play(this[soundType + "Audio"], false, 0.2);
            } else {
                // 加载音效播放
                this.loadAudio(soundType)
                    .then(audio => {
                        cc.audioEngine.play(audio, false, 0.2);
                    })
                    .catch(() => { });
            }
        }
        // 音乐
        else if (audioType == AudioType.AudioType_Music && this.musicOpen) {
            let audioIDName = soundType + audioType + "ID";
            if (this[audioIDName]) {
                cc.audioEngine.resume(this[audioIDName]);
            } else if (this[soundType + "Audio"]) {
                this[audioIDName] = cc.audioEngine.play(
                    this[soundType + "Audio"],
                    true,
                    0.2
                );
                // console.log(audioIDName + ":" + this[audioIDName]);
            } else {
                this.loadAudio(soundType)
                    .then(audio => {
                        this[audioIDName] = cc.audioEngine.play(audio, true, 0.2);
                        // console.log(audioIDName + ":" + this[audioIDName]);
                    })
                    .catch(() => { });
            }
        }
    },
    /**
     * 停止播放音乐
     * @param {soundTypes} soundType 音频资源
     */
    stopMusic(soundType) {
        let audioIDName = soundType + AudioType.AudioType_Music + "ID";
        if (this[audioIDName] != undefined) {
            cc.audioEngine.stop(this[audioIDName]);
            this[audioIDName] = undefined;
        }
    },
    /**
     * 释放音频
     * @param {soundTypes} soundType 音频资源
     */
    releaseAudio(soundType) {
        this.stopMusic(soundType);
        if (this[soundType + "Audio"]) {
            cc.loader.release(this[soundType + "Audio"]);
            this[soundType + "Audio"] = null;
        }
    },
    // 释放所有音乐资源
    releaseAllAudio() {
        cc.audioEngine.stopAll();
        for (let type in soundTypes) {
            let audioIDName = soundTypes[type] + AudioType.AudioType_Music + "ID";
            this.releaseAudio(soundTypes[type]);
            this[audioIDName] = null;
        }
    },
    stopAllAudio() {
        cc.audioEngine.stopAll();
    },
    // 停止播放背景音乐
    stopBGAudio(soundType, release) {
        if (release) {
            this.releaseAudio(soundType);
        } else {
            this.stopMusic(soundType);
        }
    },
    playEffectAudio(name) {
        this.playAudio(name, AudioType.AudioType_Effect);
    },
    playMusicAudio(name) {
        this.playAudio(name, AudioType.AudioType_Music);
    },
    stopMusicAudio(name) {
        this.stopMusic(name);
    },
    // 播放按钮音效
    playButtonAudio(index) {
        this.playEffectAudio("button_" + index);
    }
});

module.exports = AudioUtil;
