import React, { useRef, useState, useEffect } from "react";
import MediaInfoFactory from "mediainfo.js";
import type { CSSProperties } from "react";

type VideoTrack = {
    [key: string]: any;
    FrameRate?: string;
    ["@type"]: string;
};

export type RaceTrackHandle = {
    run: () => void;
    reset: () => void;
};

type RaceTrackType = {
    trackID: number
    SEGMENTS?: number
    startPos?: number
    endPos?: number
    carType?: number
    carNumber: number
};

let engineMusic: HTMLAudioElement;

const RaceTrack = React.forwardRef<RaceTrackHandle, RaceTrackType>(
    (
        {
            trackID,
            SEGMENTS = 7,
            startPos = -30,
            endPos = 65,
            carType = 1,
        },
        ref
    ) => {
        const videoRef = useRef<HTMLVideoElement | null>(null);
        const [duration, setDuration] = useState(0);
        const [fps, setFps] = useState<number>(30);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [targetFrame, setTargetFrame] = useState<number | null>(null);

        if (!engineMusic) {
            engineMusic = new Audio("/audio/engine.mp3");
            // engineMusic.loop = true;
            engineMusic.volume = 1;
        }


        // đọc metadata video
        const handleLoadedMetadata = async () => {
            if (!videoRef.current) return;
            setDuration(videoRef.current.duration);

            try {
                const src = videoRef.current.currentSrc;
                const response = await fetch(src);
                const buffer = await response.arrayBuffer();

                const mediaInfo = await MediaInfoFactory();
                const result = await mediaInfo.analyzeData(
                    () => buffer.byteLength,
                    (size, offset) => new Uint8Array(buffer.slice(offset, offset + size))
                );

                const videoTrack =
                    result.media && Array.isArray(result.media.track)
                        ? result.media.track.find((t: any) => t["@type"] === "Video") as VideoTrack
                        : null;
                const frameRate = videoTrack?.FrameRate;
                if (frameRate) setFps(parseFloat(frameRate));
            } catch (err) {
                console.warn("Không lấy được fps, mặc định 30fps");
                setFps(30);
            }
        };

        // sync video + ảnh
        useEffect(() => {
            let rafId: number;
            const check = () => {
                if (videoRef.current && targetFrame !== null) {
                    const currentFrame = Math.floor(videoRef.current.currentTime * fps);
                    const totalFrames = Math.floor(duration * fps);
                    const segmentFrames = Math.floor(totalFrames / SEGMENTS);

                    // chia đoạn đường thành SEGMENTS mốc bottom
                    const stepSize = (endPos - startPos) / SEGMENTS;
                    const prevCheckpoint = startPos + stepSize * (currentIndex - 1);
                    const nextCheckpoint = startPos + stepSize * currentIndex;

                    // progress trong đoạn [0..1] của segment hiện tại
                    const progress =
                        (currentFrame - segmentFrames * (currentIndex - 1)) / segmentFrames;
                    const clampedProgress = Math.max(0, Math.min(1, progress));

                    // nội suy từ checkpoint trước → checkpoint sau
                    const carPos =
                        prevCheckpoint +
                        (nextCheckpoint - prevCheckpoint) * clampedProgress;

                    const car = document.getElementById(`car-img-${trackID}`);
                    if (car) {
                        (car as HTMLImageElement).style.bottom = `${carPos}%`;
                    }

                    if (!videoRef.current.paused) {
                        engineMusic.play().catch(err => console.log("Không thể phát nhạc:", err));
                    } else {
                        engineMusic.pause();
                        engineMusic.currentTime = 0; // nếu muốn reset âm thanh về đầu
                    }

                    // dừng đúng checkpoint
                    if (currentFrame >= targetFrame) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = targetFrame / fps;
                        setTargetFrame(null);

                        engineMusic.pause();
                        engineMusic.currentTime = 0;
                        return;
                    }
                }
                rafId = requestAnimationFrame(check);
            };
            rafId = requestAnimationFrame(check);

            return () => cancelAnimationFrame(rafId);
        }, [targetFrame, fps, duration, currentIndex, SEGMENTS, startPos, endPos, trackID]);

        // Hàm run để chạy đến checkpoint kế tiếp
        const run = () => {
            if (videoRef.current && duration > 0) {
                const totalFrames = Math.floor(duration * fps);
                const segmentFrames = Math.floor(totalFrames / SEGMENTS);

                let nextIndex = currentIndex + 1;
                if (nextIndex > SEGMENTS) nextIndex = 1; // quay lại đầu

                const endFrame = segmentFrames * nextIndex;

                setTargetFrame(endFrame);
                videoRef.current.play();
                setCurrentIndex(nextIndex);
            }
        };

        const handleReset = () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setCurrentIndex(1);
                setTargetFrame(null);
                const car = document.getElementById(`car-img-${trackID}`);
                if (car) {
                    (car as HTMLImageElement).style.bottom = `${startPos}%`;
                }
            }
        };

        // expose run cho cha
        React.useImperativeHandle(ref, () => ({
            run,
            reset: handleReset,
        }));

        return (
            <div style={styles.container}>
                <video
                    ref={videoRef}
                    onLoadedMetadata={handleLoadedMetadata}
                    muted
                    style={styles.video}
                >
                    <source src="/raceTrack.webm" type="video/webm" />
                    Trình duyệt không hỗ trợ video.
                </video>
                <div style={styles.GroupCar} id={`car-img-${trackID}`}>
                    <img
                        src={`/cars/type_${carType}.png`}
                        alt="xe"
                        style={styles.car}
                    />
                    {/* <div style={styles.text}>{carNumber}</div> */}
                </div>
            </div>
        );
    }
);

const styles: { [key: string]: CSSProperties } = {
    container: {
        position: "relative",
        height: "100vh",
        width: "20vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
    },
    video: {
        height: "100%",
        width: "100%",
        objectFit: "fill",
    },
    GroupCar: {
        position: "absolute",
        bottom: "-30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        display: "inline-block",
    },
    car: {
        width: "100%",
        display: "block",
    },
};

export default RaceTrack