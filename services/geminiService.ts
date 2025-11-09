import type { GeneratedContent } from '../types';

// 校验速创 API 密钥是否配置
if (!process.env.SPEED_API_KEY) {
  throw new Error("SPEED_API_KEY environment variable is not set.");
}

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  maskBase64: string | null,
  secondaryImage: { base64: string; mimeType: string } | null
): Promise<GeneratedContent> {
  try {
    const response = await fetch("https://api.suchuangapi.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SPEED_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nano-banana",
        image: base64ImageData,
        prompt: prompt,
        mask: maskBase64 || undefined,
        // 如需支持 secondaryImage，请参考速创 API 文档添加相应参数
      }),
    });

    if (!response.ok) throw new Error(`API请求失败：${response.status}`);
    const data = await response.json();
    return {
      content: data.data[0].url,
      // 如需返回更多字段，请根据 GeneratedContent 类型定义补充
    } as GeneratedContent;
  } catch (error) {
    console.error("速创API调用失败：", error);
    throw error;
  }
}
