import React, { useRef, useState, useEffect } from "react";
import MediaInfoFactory from "mediainfo.js";
import type { CSSProperties } from "react";

type RaceTrackType = {
    trackID: number
    SEGMENTS?: number
    startPos?: number
    endPos?: number
}

function RaceTrack({
    trackID,
    SEGMENTS = 7,
    startPos = -20,
    endPos = 50
}: RaceTrackType) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [duration, setDuration] = useState(0);
    const [fps, setFps] = useState<number>(30);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [targetFrame, setTargetFrame] = useState<number | null>(null);

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
                    ? result.media.track.find((t: any) => t["@type"] === "Video")
                    : null;
            const frameRate = videoTrack?.["FrameRate"];
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

                // dừng đúng checkpoint
                if (currentFrame >= targetFrame) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = targetFrame / fps;
                    setTargetFrame(null);
                    return;
                }
            }
            rafId = requestAnimationFrame(check);
        };
        rafId = requestAnimationFrame(check);

        return () => cancelAnimationFrame(rafId);
    }, [targetFrame, fps, duration, currentIndex]);


    // Click để chạy đến checkpoint kế tiếp
    const handleClick = () => {
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

    return (
        <div style={styles.container} onClick={handleClick}>
            <video
                ref={videoRef}
                onLoadedMetadata={handleLoadedMetadata}
                muted
                style={styles.video}
            >
                <source src="/raceTrack.webm" type="video/webm" />
                Trình duyệt không hỗ trợ video.
            </video>
            <img
                id={`car-img-${trackID}`}
                src="/cars/type_1.png"
                alt="xe"
                style={styles.car}
            />
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        position: "relative",
        height: "100vh",
        width: "20vw",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
    },
    video: {
        height: "100%",
        width: "100%",
        objectFit: "fill",
    },
    car: {
        position: "absolute",
        bottom: "-20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "150%",
        transition: "bottom 0.05s linear"
    },
};


export default RaceTrack;
