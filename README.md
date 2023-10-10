# Image Compression Library

This library provides an easy way to compress images in the browser before uploading them to a server. By reducing the file size, it helps to save bandwidth and speed up the upload process.

## Features

- Compresses images based on a specified quality.
- Handles both JPEG and PNG images.
- Supports compressing multiple files at once.
- Automatically handles images larger than 4 megapixels by tiling them into smaller canvases before compression to avoid the browser's maximum canvas size limit.

## Installation

```bash
npm install super-compress-image
```

## Usage

Import the `CompressImg` class from the library, create a new instance, and call the `getBlob` method to compress the images.

```javascript
import CompressImg from 'compress-img';

const compressor = new CompressImg({
  files: [file1, file2],
  maxSize: 500 * 1024,  // Set the maximum file size for compression
  quality: 0.6,  // Set the compression quality
});

// Compress the images
compressor.getBlob().then(blob => {
  // Do something with the compressed image blob
  console.log(blob);
});
```

