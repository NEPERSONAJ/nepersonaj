export function extractImageUrl(data: any): string | null {
  console.log('Extracting URL from data:', JSON.stringify(data, null, 2));

  // Для объекта с choices и message
  if (data.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    // Проверяем, является ли контент URL
    if (content.trim().startsWith('http')) {
      return content.trim();
    }
  }

  // Для объекта с choices и text
  if (data.choices?.[0]?.text) {
    const text = data.choices[0].text;
    if (text.trim().startsWith('http')) {
      return text.trim();
    }
  }

  // Для прямого URL в data
  if (typeof data === 'string' && data.trim().startsWith('http')) {
    return data.trim();
  }

  // Для объекта с url
  if (data.url && typeof data.url === 'string' && data.url.trim().startsWith('http')) {
    return data.url.trim();
  }

  // Для объекта с image_url
  if (data.image_url && typeof data.image_url === 'string' && data.image_url.trim().startsWith('http')) {
    return data.image_url.trim();
  }

  // Для вложенных объектов
  if (data.data?.[0]?.url && typeof data.data[0].url === 'string' && data.data[0].url.trim().startsWith('http')) {
    return data.data[0].url.trim();
  }

  if (data.result?.url && typeof data.result.url === 'string' && data.result.url.trim().startsWith('http')) {
    return data.result.url.trim();
  }

  // Для массива
  if (Array.isArray(data)) {
    for (const item of data) {
      if (typeof item === 'string' && item.trim().startsWith('http')) {
        return item.trim();
      }
      if (item.url && typeof item.url === 'string' && item.url.trim().startsWith('http')) {
        return item.url.trim();
      }
    }
  }

  // Поиск URL в любом текстовом поле
  const jsonString = JSON.stringify(data);
  const urlMatch = jsonString.match(/"(https?:\/\/[^"\s]+)"/);
  if (urlMatch) {
    return urlMatch[1].trim();
  }

  return null;
}