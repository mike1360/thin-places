"use client";

import ARSessionWrapper from "@/components/ARSessionWrapper";
import SceneLoader from "@/components/SceneLoader";
import SwarmScene from "@/components/SwarmScene";

export default function SwarmStation() {
  return (
    <ARSessionWrapper
      stationName="The Swarm"
      stationNumber="01"
      accentColor="#a855f7"
    >
      <SceneLoader stationName="The Swarm" color="#a855f7" loadingLabel="Loading The Swarm...">
        <SwarmScene />
      </SceneLoader>
    </ARSessionWrapper>
  );
}
