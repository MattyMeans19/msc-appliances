"use client";

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface Props { 
  newName: (name:string) => void;
}

export default function BGPhotoUpload(props: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
<CldUploadButton
  uploadPreset='single-no-camera'
  options={{
    sources: ["local", "url"],
    multiple: false,
  }}
  onSuccess={(results: CloudinaryUploadWidgetResults) => {
  if (results.info && typeof results.info !== 'string') {
    const publicId = results.info.public_id; 
    props.newName(publicId)
  }
}}
className='rounded-full p-2 bg-red-500 w-fit self-center'
>
    Upload Photo
</CldUploadButton>
  );
}