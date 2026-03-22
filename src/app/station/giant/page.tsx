"use client";

import ARSessionWrapper from "@/components/ARSessionWrapper";
import SceneLoader from "@/components/SceneLoader";
import GiantScene from "@/components/GiantScene";

export default function GiantStation() {
  return (
    <ARSessionWrapper
      stationName="The Giant"
      stationNumber="03"
      accentColor="#f59e0b"
    >
      <SceneLoader stationName="The Giant" color="#f59e0b" loadingLabel="Summoning The Giant...">
        <GiantScene />
      </SceneLoader>
    </ARSessionWrapper>
  );
}
