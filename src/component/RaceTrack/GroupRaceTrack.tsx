import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import RaceTrack from "./RaceTrack";

function GroupRaceTrack() {
  return (
    <div style={styles.container}>
      <RaceTrack trackID={1} carType={6} carNumber={1}/>
      <RaceTrack trackID={2} carType={7} carNumber={2}/>
      <RaceTrack trackID={3} carType={8} carNumber={3}/>
      <RaceTrack trackID={4} carType={9} carNumber={4}/>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: 'Black',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  }
}

export default GroupRaceTrack;