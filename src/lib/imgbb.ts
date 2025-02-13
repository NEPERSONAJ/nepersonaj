const IMGBB_API_KEY = '00af209468908565819121ce9eef1f71';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}