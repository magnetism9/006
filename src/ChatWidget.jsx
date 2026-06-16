import React, { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'

const WELCOME = '안녕하세요! 드림아이티비즈 AI 도우미입니다 😊\n강의, 자격증, 수강 방법 등 무엇이든 질문해주세요!'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [msgs, open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || busy) return

    const userMsg = { role: 'user', content: text }
    const next = [...msgs, userMsg]
    setMsgs(next)
    setInput('')
    setBusy(true)

    try {
      if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.')
      const history = next.slice(1).map(({ role, content }) => ({ role, content }))
      const { data, error } = await supabase.functions.invoke('rest06-chat', {
        body: { messages: history },
      })
      if (error) throw new Error(error.message)
      setMsgs((p) => [...p, { role: 'assistant', content: data.content }])
    } catch (e) {
      setMsgs((p) => [...p, { role: 'assistant', content: `오류: ${e.message}` }])
    } finally {
      setBusy(false)
    }
  }, [input, busy, msgs])

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // ── 스타일 (CSS 변수 사용) ──────────────────────────────────────────────────

  const S = {
    wrap: {
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
    },
    bubble: {
      width: '54px', height: '54px', borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: 'linear-gradient(135deg, var(--a2, #a3e635), var(--a1, #22d3ee))',
      boxShadow: '0 4px 20px rgba(0,0,0,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22px', transition: 'transform .15s',
      flexShrink: 0,
    },
    card: {
      width: '340px', maxHeight: '480px',
      background: 'var(--panel, #12141c)',
      border: '1px solid rgba(var(--line, 255,255,255),.1)',
      borderRadius: '18px',
      boxShadow: '0 20px 60px rgba(0,0,0,.45)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    },
    header: {
      padding: '14px 16px 12px',
      background: 'linear-gradient(135deg, rgba(var(--a2-rgb, 163,230,53),.18), rgba(var(--a1-rgb, 34,211,238),.12))',
      borderBottom: '1px solid rgba(var(--line, 255,255,255),.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: '14px', fontWeight: 700, color: 'var(--text, #e8eaf0)',
      display: 'flex', alignItems: 'center', gap: '7px',
    },
    dot: {
      width: '7px', height: '7px', borderRadius: '50%',
      background: 'var(--a2, #a3e635)',
      boxShadow: '0 0 6px var(--a2, #a3e635)',
    },
    closeBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: 'var(--muted, #9aa0b4)', fontSize: '18px', lineHeight: 1,
      padding: '2px 6px', borderRadius: '6px',
    },
    msgList: {
      flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    },
    userBubble: {
      alignSelf: 'flex-end', maxWidth: '80%',
      background: 'linear-gradient(135deg, var(--a2, #a3e635), var(--a1, #22d3ee))',
      color: '#0a0b10', borderRadius: '14px 14px 4px 14px',
      padding: '9px 13px', fontSize: '13.5px', lineHeight: 1.55, fontWeight: 500,
    },
    aiBubble: {
      alignSelf: 'flex-start', maxWidth: '85%',
      background: 'rgba(var(--line, 255,255,255),.06)',
      color: 'var(--text, #e8eaf0)', borderRadius: '14px 14px 14px 4px',
      padding: '9px 13px', fontSize: '13.5px', lineHeight: 1.6,
    },
    typing: {
      alignSelf: 'flex-start', padding: '10px 14px',
      background: 'rgba(var(--line, 255,255,255),.06)',
      borderRadius: '14px 14px 14px 4px',
      display: 'flex', gap: '5px', alignItems: 'center',
    },
    dot1: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--muted, #9aa0b4)', animation: 'dib-bounce .9s ease-in-out infinite' },
    dot2: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--muted, #9aa0b4)', animation: 'dib-bounce .9s ease-in-out .18s infinite' },
    dot3: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--muted, #9aa0b4)', animation: 'dib-bounce .9s ease-in-out .36s infinite' },
    inputRow: {
      padding: '10px 12px',
      borderTop: '1px solid rgba(var(--line, 255,255,255),.07)',
      display: 'flex', gap: '8px', alignItems: 'flex-end',
    },
    textarea: {
      flex: 1, resize: 'none', border: '1px solid rgba(var(--line, 255,255,255),.1)',
      borderRadius: '11px', padding: '9px 12px',
      background: 'rgba(var(--line, 255,255,255),.05)',
      color: 'var(--text, #e8eaf0)', fontSize: '13.5px', lineHeight: 1.45,
      fontFamily: 'inherit', outline: 'none', maxHeight: '90px',
    },
    sendBtn: {
      width: '38px', height: '38px', flexShrink: 0, border: 'none', borderRadius: '10px',
      background: 'linear-gradient(135deg, var(--a2, #a3e635), var(--a1, #22d3ee))',
      color: '#0a0b10', cursor: 'pointer', fontSize: '16px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 900,
    },
  }

  return (
    <>
      {/* 타이핑 애니메이션 keyframes */}
      <style>{`
        @keyframes dib-bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>

      <div style={S.wrap}>
        {/* 채팅 카드 */}
        {open && (
          <div style={S.card}>
            {/* 헤더 */}
            <div style={S.header}>
              <div style={S.headerTitle}>
                <div style={S.dot} />
                DreamIT AI 도우미
              </div>
              <button style={S.closeBtn} onClick={() => setOpen(false)} aria-label="닫기">×</button>
            </div>

            {/* 메시지 목록 */}
            <div style={S.msgList}>
              {msgs.map((m, i) => (
                <div key={i} style={m.role === 'user' ? S.userBubble : S.aiBubble}>
                  {m.content.split('\n').map((ln, j) => (
                    <React.Fragment key={j}>{ln}{j < m.content.split('\n').length - 1 && <br />}</React.Fragment>
                  ))}
                </div>
              ))}
              {busy && (
                <div style={S.typing}>
                  <div style={S.dot1} />
                  <div style={S.dot2} />
                  <div style={S.dot3} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* 입력창 */}
            <div style={S.inputRow}>
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="질문을 입력하세요…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                style={S.textarea}
                disabled={busy}
              />
              <button style={{ ...S.sendBtn, opacity: busy || !input.trim() ? 0.5 : 1 }} onClick={send} disabled={busy || !input.trim()} aria-label="전송">
                ➤
              </button>
            </div>
          </div>
        )}

        {/* 플로팅 버튼 */}
        <button
          style={{ ...S.bubble, transform: open ? 'rotate(15deg) scale(.95)' : 'none' }}
          onClick={() => setOpen((v) => !v)}
          aria-label="AI 채팅 열기"
        >
          {open ? '✕' : '💬'}
        </button>
      </div>
    </>
  )
}
