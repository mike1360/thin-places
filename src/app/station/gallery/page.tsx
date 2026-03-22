"use client";

import SceneLoader from "@/components/SceneLoader";
import WebXRAR from "@/components/WebXRAR";

export default function GalleryStation() {
  return (
    <SceneLoader stationName="The Gallery" color="#ffffff" loadingLabel="Preparing AR...">
      <WebXRAR />
    </SceneLoader>
  );
}
