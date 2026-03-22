"use client";

import ARSessionWrapper from "@/components/ARSessionWrapper";
import SceneLoader from "@/components/SceneLoader";
import PortalScene from "@/components/PortalScene";

export default function PortalStation() {
  return (
    <ARSessionWrapper
      stationName="The Portal"
      stationNumber="02"
      accentColor="#06b6d4"
    >
      <SceneLoader stationName="The Portal" color="#06b6d4" loadingLabel="Opening The Portal...">
        <PortalScene />
      </SceneLoader>
    </ARSessionWrapper>
  );
}
