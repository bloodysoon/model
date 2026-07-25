export async function uploadImage(file: File, expiration?: number) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const formData = new FormData();
    formData.append('image', base64);

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('IMGBB_API_KEY is not set in environment variables');
    }

    const url = new URL('https://api.imgbb.com/1/upload');
    url.searchParams.append('key', apiKey);
    
    if (expiration) {
      url.searchParams.append('expiration', expiration.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`imgBB upload failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(`imgBB upload failed with status: ${data.status}`);
    }

    console.log('imgBB upload success:', data.data);
    
    return {
      url: data.data.url,
      deleteUrl: data.data.delete_url,
      id: data.data.id,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(deleteUrl: string) {
  try {
    const response = await fetch(deleteUrl);
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}
