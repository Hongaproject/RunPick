"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface KakaoMapProps {
  placeName: string;
}

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapInstance {
  setCenter(coords: KakaoLatLng): void;
}

interface KakaoMarker {
  getPosition(): KakaoLatLng;
}

interface KakaoInfoWindow {
  open(map: KakaoMapInstance, marker: KakaoMarker): void;
}

interface KakaoPlaceResult {
  x: string;
  y: string;
  place_name: string;
}

interface KakaoAddressResult {
  x: string;
  y: string;
}

type KakaoStatus = string;

interface KakaoServices {
  Places: new () => {
    keywordSearch(
      keyword: string,
      callback: (result: KakaoPlaceResult[], status: KakaoStatus) => void,
    ): void;
  };
  Geocoder: new () => {
    addressSearch(
      address: string,
      callback: (result: KakaoAddressResult[], status: KakaoStatus) => void,
    ): void;
  };
  Status: { OK: string };
}

interface KakaoMaps {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  Marker: new (options: {
    map: KakaoMapInstance;
    position: KakaoLatLng;
  }) => KakaoMarker;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
  services: KakaoServices;
}

declare global {
  interface Window {
    kakao: { maps: KakaoMaps };
  }
}

export default function KakaoMap({ placeName }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !placeName || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;
      if (!container) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });

      const places = new window.kakao.maps.services.Places();

      places.keywordSearch(placeName, (result, status) => {
        if (
          status === window.kakao.maps.services.Status.OK &&
          result.length > 0
        ) {
          const coords = new window.kakao.maps.LatLng(
            parseFloat(result[0].y),
            parseFloat(result[0].x),
          );
          map.setCenter(coords);

          const marker = new window.kakao.maps.Marker({
            map,
            position: coords,
          });
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;white-space:nowrap">${placeName}</div>`,
          });
          infowindow.open(map, marker);
        } else {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(placeName, (result, status) => {
            if (
              status === window.kakao.maps.services.Status.OK &&
              result.length > 0
            ) {
              const coords = new window.kakao.maps.LatLng(
                parseFloat(result[0].y),
                parseFloat(result[0].x),
              );
              map.setCenter(coords);
              new window.kakao.maps.Marker({ map, position: coords });
            }
          });
        }
      });
    });
  }, [scriptLoaded, placeName]);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="w-full rounded-xl overflow-hidden border border-gray-200">
        <div ref={mapRef} className="w-full h-96" />
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex items-center gap-1">
          📍 {placeName}
        </div>
      </div>
    </>
  );
}
