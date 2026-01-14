"use client";

import { CldUploadWidget } from 'next-cloudinary';

export default function SignedUpload() {
  return (
<CldUploadWidget
  signatureEndpoint="/api/sign-cloudinary" // Just a string!
  options={{
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    sources: ["local", "url", "camera"],
    multiple: false
  }}
  onSuccess={(results) => {
    // Save to DB logic here
  }}
>
  {({ open }) => <button onClick={() => open()}>Upload Photo</button>}
</CldUploadWidget>
  );
}