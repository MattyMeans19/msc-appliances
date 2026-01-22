"use client";

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface Props { 
  addPhotos: (name:string) => void;
}

export default function InventoryPhotoUpload(props: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
<CldUploadButton
  uploadPreset='single-no-camera'
  options={{
    sources: ["local", "url", 'camera'],
  }}
  onSuccess={(results: CloudinaryUploadWidgetResults) => {
  if (results.info && typeof results.info !== 'string') {
    const publicId = results.info.public_id;
    props.addPhotos(publicId)
  }
}}
className='row-start-5 col-span-full rounded-full p-2 bg-red-500 border-2 w-fit place-self-center'
>
    Upload Photos
</CldUploadButton>
  );
}