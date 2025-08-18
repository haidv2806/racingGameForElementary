import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import RaceTrack from "./RaceTrack";

function GroupRaceTrack() {
  return (
    <div style={styles.container}>
      <RaceTrack trackID={1} carType={6}/>
      <RaceTrack trackID={2} carType={7} />
      <RaceTrack trackID={3} carType={8} />
      <RaceTrack trackID={4} carType={9} />
      {/* <RaceTrackHorizontal trackID={1} carType={6}/>
      <RaceTrackHorizontal trackID={2} carType={7}/>
      <RaceTrackHorizontal trackID={3} carType={8}/>
      <RaceTrackHorizontal trackID={4} carType={9}/> */}
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  }
}

export default GroupRaceTrack;