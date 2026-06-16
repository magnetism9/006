const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM = '당신은 드림아이티비즈(DreamIT Biz) 온라인 IT 교육 플랫폼의 친절한 AI 도우미입니다. ' +
  '강의, 자격증, 수강 방법, 결제 등 플랫폼 관련 질문에 한국어로 간결하게 답변해주세요.'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { messages } = await req.json()

    const solarKey = Deno.env.get('SOLAR_API_KEY')
    const openaiKey = Deno.env.get('OPENAI_API_KEY')

    if (!solarKey && !openaiKey) {
      return new Response(
        JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
      )
    }

    let res: Response

    if (solarKey) {
      res = await fetch('https://api.upstage.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${solarKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'solar-pro',
          messages: [{ role: 'system', content: SYSTEM }, ...messages],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })
    } else {
      res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM }, ...messages],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })
    }

    const json = await res.json()
    const content: string = json.choices?.[0]?.message?.content ?? '응답을 받지 못했습니다.'

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    )
  }
})
